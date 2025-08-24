import axios from 'axios';

const Meals_URL = `${ import.meta.env.VITE_BACK_END_SERVER_URL }/meals`;
const Recipes_URL = `${ import.meta.env.VITE_BACK_END_SERVER_URL }/recipes`;
const TRIMMED_URL = `${ import.meta.env.VITE_BACK_END_SERVER_URL }`;
// const RecipeCollection_URL = `${ import.meta.env.VITE_BACK_END_SERVER_URL }/collections/:userId/recipes-collection`;
// const MealsCollection_URL = `${ import.meta.env.VITE_BACK_END_SERVER_URL }/collections/:userId/meals-collection`;

const Index = async (type, userId) => {
    let BASE_URL = null;
    try {
        if (type === "Meal") { BASE_URL = Meals_URL; }
        else if (type === "Recipe") { BASE_URL = Recipes_URL; }
        else {
            if (type === "RecipeCollection") {
                BASE_URL = `${ TRIMMED_URL }/${ userId }/recipes-collection`;
            } else if (type === "MealCollection") {
                BASE_URL = `${ TRIMMED_URL }/${ userId }/meals-collection`;
            } else {
                throw new Error("Type not set");
            }
        }
        const res = await axios.get(BASE_URL, {
            headers: { Authorization: `Bearer ${ localStorage.getItem("token") }` },
        });

        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const Show = async (type, itemId) => {
    let BASE_URL = null;
    try {
        if (type === "Meal") { BASE_URL = Meals_URL; }
        else if (type === "Recipe") { BASE_URL = Recipes_URL; }
        else { throw new Error("Type not set"); }
        const res = await axios.get(`${ BASE_URL }/${ itemId }`, {
            headers: { Authorization: `Bearer ${ localStorage.getItem("token") }` },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const Create = async (type, formData, itemId, commentId) => {
    let BASE_URL = null;
    try {
        switch (type) {
            case "Meal":
                BASE_URL = Meals_URL;
                break;
            case "Recipe":
                BASE_URL = Recipes_URL;
                break;
            case "RecipeComment":
                BASE_URL = `${ Recipes_URL }/${ itemId }/comments`;
                break;
            case "MealComment":
                BASE_URL = `${ Meals_URL }/${ itemId }/comments`;
                break;
            case "RecipeReply":
                BASE_URL = `${ Recipes_URL }/${ itemId }/comments/${ commentId }`;
                break;
            case "MealReply":
                BASE_URL = `${ Meals_URL }/${ itemId }/comments/${ commentId }`;
                break;
            default:
                throw new Error("Type not set");
        }
        const res = await axios.post(BASE_URL, formData, {
            headers: { Authorization: `Bearer ${ localStorage.getItem("token") }` },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const Delete = async (type, itemId, commentId, replyId) => {
    let BASE_URL = null;
    try {
        switch (type) {
            case "Meal":
                BASE_URL = `${ Meals_URL }/${ itemId }`;
                break;
            case "Recipe":
                BASE_URL = `${ Recipes_URL }/${ itemId }`;
                break;
            case "RecipeComment":
                BASE_URL = `${ Recipes_URL }/${ itemId }/comments/${ commentId }`;
                break;
            case "MealComment":
                BASE_URL = `${ Meals_URL }/${ itemId }/comments/${ commentId }`;
                break;
            case "RecipeReply":
                BASE_URL = `${ Recipes_URL }/${ itemId }/comments/${ commentId }/${ replyId }`;
                break;
            case "MealReply":
                BASE_URL = `${ Meals_URL }/${ itemId }/comments/${ commentId }/${ replyId }`;
                break;
            default:
                throw new Error("Type not set");
        }
        const res = await axios.delete(BASE_URL, {
            headers: { Authorization: `Bearer ${ localStorage.getItem("token") }` },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const Update = async (type, formData, itemId, commentId, replyId) => {
    let BASE_URL = null;
    try {
        switch (type) {
            case "Meal":
                BASE_URL = `${ Meals_URL }/${ itemId }`;
                break;
            case "Recipe":
                BASE_URL = `${ Recipes_URL }/${ itemId }`;
                break;
            case "RecipeComment":
                BASE_URL = `${ Recipes_URL }/${ itemId }/comments/${ commentId }`;
                break;
            case "MealComment":
                BASE_URL = `${ Meals_URL }/${ itemId }/comments/${ commentId }`;
                break;
            case "RecipeReply":
                BASE_URL = `${ Recipes_URL }/${ itemId }/comments/${ commentId }/${ replyId }`;
                break;
            case "MealReply":
                BASE_URL = `${ Meals_URL }/${ itemId }/comments/${ commentId }/${ replyId }`;
                break;
            default:
                throw new Error("Type not set");
        }
        console.log(BASE_URL)
        const res = await axios.put(BASE_URL, formData, {
            headers: { Authorization: `Bearer ${ localStorage.getItem("token") }` },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export { Index, Show, Create, Delete, Update };