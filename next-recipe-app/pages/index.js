import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { sanityClient, urlFor } from "../lib/sanity";
import { gsap, Power2 } from "gsap/dist/gsap";
import Image from "next/image";

const recipesQuery = `*[_type == "recipe"]{
  _id,
  name,
  slug,
  mainImage,
  chef-> {
    _id,
    name,
    image,
  },
  likes
}`;


const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)



   

export default function Home({ recipes }) {

  // const recipesRef = useRef((recipes?.map(() => createRef())))

  // console.log(recipesRef)


  useEffect(() => {
    if(recipes?.length > 0 ){

      gsap.to(".home-title", {
        opacity: "1",
        x: "0",
        scale: "1",
        ease: Power2.easeOut,
        duration: 1,
      })

      gsap.to(".recipe-card:nth-child(1)", {
        opacity: "1",
        x: "0",
        ease: Power2.easeOut,
        duration: 1,
      })
      gsap.to(".recipe-card:nth-child(2)", {
        opacity: "1",
        x: "0",
        ease: Power2.easeOut,
        duration: 1,
      })
      gsap.to(".recipe-card:nth-child(3)", {
        opacity: "1",
        x: "0",
        ease: Power2.easeOut,
        duration: 1,
      })
      gsap.to(".recipe-card:nth-child(4)", {
        opacity: "1",
        x: "0",
        ease: Power2.easeOut,
        duration: 1,
      })

      gsap.to(".recipe-card:nth-child(5)", {
        opacity: "1",
        x: "0",
        ease: Power2.easeOut,
        duration: 1,
      })
      
      
    }
   
  },[])

  
  const toUrl = (data) => {
    return urlFor(data).url()
  }


  return (
    <div>
      <Head>
        <title>Chef&apos;s Kitchen</title>
        <meta name="description" content="Generated by next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="home-title">Welcome to Chef&apos;s Kitchen </h1>

      <ul className="recipes-list">
        {recipes?.length > 0 &&
          recipes.map((recipe) => (
            <li key={recipe._id}  className="recipe-card">
              <Link href={`/recipes/${recipe.slug.current}`}>
                <a>
                  <div className="chef-info">
                    <Image
                      src={`${toUrl(recipe?.chef?.image)}`}
                      alt={recipe.chef.name}
                      height="70"
                      width="70"
                      unoptimized

                    />
                    <span>Chef | {recipe.chef.name}</span>
                  </div>
                  <div className="recipe-mainImage">
                    <Image
                      src={`${toUrl(recipe?.mainImage)}`}
                      alt={recipe.name}
                      title={recipe.title}
                      height="300"
                      width="380"
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(380, 300))}`}
                      unoptimized
                    />
                    <div className="overlay"></div>
                  </div>
                  <div className="recipe-wrap-name">
                    <span>{recipe.name}</span>
                    <span className="recipe-likes"> {recipe.likes} ??????</span>
                  </div>
                </a>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const recipes = await sanityClient.fetch(recipesQuery);
  return {
    props: {
      recipes,
    },
  };
}
