export default {
    name: "chef",
    title: "Chef",
    type: 'document',
    fields: [
        {
            name: "name",
            title: "Chef's Name",
            type: "string"
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
              source: "name",
              maxLength: 96,
            },
        },
        {
            name: "image",
            title: "Image",
            type: "image",
            options: {
                hotspot: true,
            },
        },
        {
            name: "bio",
            title: "Bio",
            type: "array",
            of: [
                    {
                        title: "Block",
                        type: "block",
                        styles: [
                            {
                                title: "Normal",
                                value: "normal"
                            },
                        ],
                        lists: [],
                    },
            ],
        },
    ],

}