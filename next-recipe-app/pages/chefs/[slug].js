import { useRouter } from "next/router";

import {
  sanityClient,
  urlFor,
  PortableText,
} from "../../lib/sanity";


const chefQuery = `*[_type == "chef" && slug.current == $slug][0]{
    name,
    _id,
    slug,
    bio,
    image
}`


export default function OneChef({ data }) {

    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }


    return (
        <article className="chef">
          <div className="wrap-chef-title">
                <h1>Chef | {data?.chef?.name}</h1>
                <img className="chef-profile-image" src={data?.chef?.image ? urlFor(data?.chef?.image).url() : null}  />
                <PortableText value={data?.chef?.bio} className="bio" />
           </div>
        </article>
      );



}

export async function getStaticPaths() {
    const paths = await sanityClient.fetch(
      `*[_type == "chef" && defined(slug.current)] {
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
    const chef = await sanityClient.fetch(chefQuery, { slug });
    return { props: { data: { chef }, preview: true }, revalidate: 5 };
}