import {
    createClient,
    createPreviewSubscriptionHook,
    PortableText as PortableTextComponent,
} from "next-sanity"

import createImageUrlBuilder from '@sanity/image-url'

const config = {
    projectId: "j75sc3mb",
    dataset: "production",
    apiVersion: "2021-03-25",
    useCdn: false
}

export const sanityClient = createClient(config)

export const usePreviewSubscription = createPreviewSubscriptionHook(config)

export const urlFor = (source) => createImageUrlBuilder(config).image(source)

export const PortableText = (props) => <PortableTextComponent  {...props}/>