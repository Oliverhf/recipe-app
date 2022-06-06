import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { gsap, Power3 } from "gsap/dist/gsap";


import {
  sanityClient,
  urlFor,
  // usePreviewSubscription,
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
    chef-> {
        _id,
        name,
        image,
        slug
    },
    instructions,
    likes
}`;

export default function OneRecipe({ data }) {
  // const { data: recipe } = usePreviewSubscription(recipeQuery, {
  //   params: { slug: data?.recipe?.slug?.current },
  //   initialData: data,
  //   enabled: preview,
  // });

  const [likes, setlikes] = useState(data?.recipe?.likes);

  useEffect(() => {
    if(data?.recipe?.name.length > 0 ){
      gsap.to(".wrap-recipe-title", {
        opacity: "1",
        x: "0",
        scale: "1",
        ease: Power3.easeInOut,
        delay: "0.1",
        duration: 1,
      })
    }

    if(data?.recipe?.chef) {
      gsap.to(".recipe .chef-recipe-info", {
        opacity: "1",
        x: "0",
        scale: "1",
        ease: Power3.easeInOut,
        delay: "0.1",
        duration: 1,
      })
    }
   
  },[])

  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  

  const addLike = async () => {
    const res = await fetch("/api/handle-like", {
      method: "POST",
      body: JSON.stringify({
        _id: data.recipe._id,
      }),
    }).catch((error) => console.log(error));

    const newdata = await res.json();

    setlikes(newdata.likes);
  };





  return (
    <article className="recipe">
      <div className="wrap-recipe-title">
        <h1>{data?.recipe?.name}</h1>
        <button className="like-button" onClick={addLike}>
                {likes} ❤️
        </button>
      </div>
      <br />
      {data?.recipe?.chef && (
        <div className="chef-recipe-info">
          <img
            src={
              data?.recipe?.chef?.image
                ? urlFor(data?.recipe?.chef?.image).url()
                : "https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif"
            }
            alt={data?.recipe?.chef?.name}
          />
          <Link href={`/chefs/${data?.recipe?.chef?.slug?.current}`}>
            <a>
                <h2 className="chef-name">Chef | {data?.recipe?.chef?.name}</h2>
            </a>
          </Link>
        </div>
      )}
      <main className="breakdown">
        <img
          src={
            data?.recipe?.mainImage
              ? urlFor(data?.recipe?.mainImage).url()
              : "https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif"
          }
          alt={data?.recipe?.name}
        />
        <div className="wrap-ingredients">
          <h2 className="ingredients-title">Ingredients</h2>
          <ul className="ingredients">
            {data?.recipe?.ingredient?.map((ingredient) => (
              <li key={ingredient?._key} className="ingredient">
                <p>
                  {ingredient?.wholeNumber
                    ? `▥ ${"Whole Number"}: ${ingredient.wholeNumber}`
                    : null}
                </p>
                <p>
                  {ingredient?.fraction
                    ? `▥ ${"Fraction"}: ${ingredient.fraction}`
                    : null}
                </p>
                <p>
                  {ingredient?.unity
                    ? `▥ ${"Unity"}: ${ingredient.unity}`
                    : null}
                </p>
                <span className="ingredient-name">
                  {ingredient?.ingredient?.name}
                </span>
              </li>
            ))}
          </ul>
          <PortableText value={data?.recipe?.instructions} className="instructions" />
        </div>
      </main>
    </article>
  );
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
  return { props: { data: { recipe }, preview: false}, revalidate: 5 };
}
