import { useRouter } from "next/router";
import { useState } from "react";

import {
  sanityClient,
  urlFor,
  usePreviewSubscription,
  PortableText,
} from "../../lib/sanity";

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[] {
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        },
    },
    instructions,
    likes
}`;

export default function OneRecipe({data , preview}) {

    const router = useRouter()

    if(router.isFallback) {
        return <div>Loading...</div>
    }

    const {data: recipe} = usePreviewSubscription(recipeQuery, {
        params: {slug: data?.recipe?.slug?.current},
        initialData: data,
        enabled: preview
    })


    const [likes, setlikes] = useState(data?.recipe?.likes)
  

    const addLike = async () => {
        const res = await fetch("/api/handle-like", {
            method: "POST",
            body: JSON.stringify({
                _id: recipe._id,
            })
        }).catch((error) => console.log(error))

        const data = await res.json()

        setlikes(data.likes)
    }
 
    return (
        <article className="recipe">
            <h1>{recipe?.name}</h1>
            <button
                className="like-button"
                onClick={addLike}
            >{
                likes}❤️
            </button>
            <main className="breakdown">
                <img src={recipe?.mainImage ? urlFor(recipe?.mainImage).url() : "data:image/jpeg;base64,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"} alt={recipe?.name}  />
                <div>
                    <ul className="ingredients">
                        {recipe.ingredient?.map((ingredient) => (
                            <li key={ingredient?._key} className="ingredient">
                                {ingredient?.wholeNumber}
                                {ingredient?.fraction}
                                {ingredient?.unity}
                                <br/>
                                {ingredient?.ingredient?.name}
                            </li>
                        ))}
                    </ul>
                    <PortableText 
                        value={recipe?.instructions}
                        className="instructions"
                    />
                </div>
            </main>
        </article>
    )
}

export async function getStaticPaths() {
  const paths = await sanityClient.fetch(
    `*[_type == "recipe" && defined(slug.current)] {
            "params": {
                "slug": slug.current
            }
        }`
  );

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug });
  return { props: { data: { recipe }, preview: true } };
}
