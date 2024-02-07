import { ItemTypes } from "@/ts/types/dnd.types"
import { ContainerTypes } from '../../ts/types/dnd.types';
import { DraggableNameType } from "@/components/artist-list-container";

export const TEST_ARTISTS: DraggableNameType[] = [
    {
        id: "1",
        name: "Johnny Riches", 
        email: "some.email1@gmail.com", 
        website_url: "https://google.com", 
        genre: ["Sculpture"], 
        location:{
            description: "Chicago, IL USA",
            coordinates: {
                latitude: 41.8781136,
                longitude: -87.6297982
            },
        },
        date_added: new Date ("2023-11-28T08:00:00.138Z"), 
        preview_img: "johnny_riches.png",
        title: "Johnny Riches", 
        type: ItemTypes.BOX,
        top: 0,
        left: 0,
        list: "main" as ContainerTypes
    }, {
        id: "2",
        name: "Ibrahim Hopkins", 
        email: "some.email2@gmail.com", 
        website_url: "https://google.com", 
        genre: ["Sound", "Prose & Poetry"], 
        location:{
            description: "Chicago, IL USA",
            coordinates: {
                latitude: 41.8781136,
                longitude: -87.6297982
            },
        },
        date_added: new Date ("2023-11-29T08:00:00.138Z"), 
        preview_img: "ibrahim_hopkins.png",
        title: "Ibrahim Hopkins", 
        type: ItemTypes.BOX,
        top: 0,
        left: 0,
        list: "main" as ContainerTypes
    }, {
        id: "3",
        name: "Sofia Wheeler", 
        email: "some.email3@gmail.com", 
        website_url: "https://google.com", 
        genre: ["Graphic Design", "Fashion & Costume"], 
        location:{
            description: "New York, NY USA",
            coordinates: {
                latitude: 40.7127753,
                longitude: -74.0059728
            },
        },
        date_added: new Date("2023-11-30T08:00:00.871Z"), 
        preview_img: "sofia_wheeler.png",
        title: "Sofia Wheeler", 
        type: ItemTypes.BOX,
        top: 0,
        left: 0,
        list: "main" as ContainerTypes
    }, {
        id: "4",
        name: "Conner Garrison", 
        email: "some.email4@gmail.com", 
        website_url: "https://google.com", 
        genre: ["Painting & Drawing"], 
        location:{
            description: "Manchester, UK",
            coordinates: {
                latitude: 51.5072178,
                longitude: -0.1275862
            },
        },
        date_added: new Date ("2023-12-01T08:00:00.138Z"), 
        preview_img: "conner_garrison.png",
        title: "Conner Garrison", 
        type: ItemTypes.BOX,
        top: 0,
        left: 0,
        list: "main" as ContainerTypes
    }, {
        id: "5",
        name: "Selima Khalil", 
        email: "some.email5@gmail.com", 
        website_url: "https://google.com", 
        genre: ["Research", "Archival", "Organizing & Education"], 
        location:{
            description: "London, UK",
            coordinates: {
                latitude: 53.4807593,
                longitude: -2.2426305
            },
        },
        date_added: new Date ("2023-12-02T08:00:00.138Z"), 
        preview_img: "selima_khalil.png",
        title: "Selima Khalil", 
        type: ItemTypes.BOX,
        top: 0,
        left: 0,
        list: "main" as ContainerTypes
    }, {
        id: "6",
        name: "Lily Liu", 
        email: "some.email6@gmail.com", 
        website_url: "https://google.com", 
        genre: ["Moving Image", "Photography"], 
        location:{
            description: "Los Angeles, CA USA",
            coordinates: {
                latitude: 34.0549076,
                longitude: -118.242643
            },
        },
        date_added: new Date("2023-11-25T08:00:00.871Z"), 
        preview_img: "lily_liu.png",
        title: "Lily Liu", 
        type: ItemTypes.BOX,
        top: 0,
        left: 0,
        list: "main" as ContainerTypes
    }, {
        id: "7",
        name: "Ada Lovelace", 
        email: "some.email7@gmail.com", 
        website_url: "https://google.com", 
        genre: ["Performance", "Installation", "Sculpture"], 
        location:{
            description: "Los Angeles, CA USA",
            coordinates: {
                latitude: 34.0549076,
                longitude: -118.242643
            },
        },
        date_added: new Date ("2023-11-22T08:00:00.138Z"), 
        preview_img: "ada_lovelace.png",
        title: "Ada Lovelace", 
        type: ItemTypes.BOX,
        top: 0,
        left: 0,
        list: "main" as ContainerTypes
    },
]

export default TEST_ARTISTS