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

  
    const {data: recipe} = usePreviewSubscription(recipeQuery, {
        params: {slug: data?.recipe?.slug?.current},
        initialData: data,
        enabled: preview
    })

    const [likes, setlikes] = useState(data?.recipe?.likes)

    const router = useRouter()

    if(router.isFallback) {
        return <div>Loading...</div>
    }

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
                <img src={data?.recipe?.mainImage ? urlFor(data?.recipe?.mainImage).url() : "https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif"} alt={recipe?.name}  />
                <div>
                    <ul className="ingredients">
                        {data?.recipe?.ingredient?.map((ingredient) => (
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
