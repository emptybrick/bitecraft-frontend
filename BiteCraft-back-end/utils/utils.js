const { shuffle, chunk, concat } = require("lodash");
const { create, all, add } = require('mathjs');
const config = {
    number: 'Fraction'
};

const math = create(all, config);

const handleMealPlan = (data, type) => {

    const shuffledMeals = shuffle(data);
    let week1;
    let week2;
    let week3;
    let week4;
    if (type === "Auto") {

        if (data.length < 28) {
            let newMealsArray = [];
            while (newMealsArray.length < 28) {
                newMealsArray = concat(newMealsArray, shuffledMeals);
            }
            const trimmedMealsArray = chunk(newMealsArray, 7);
            week1 = trimmedMealsArray[ 0 ];
            week2 = trimmedMealsArray[ 1 ];
            week3 = trimmedMealsArray[ 2 ];
            week4 = trimmedMealsArray[ 3 ];
        } else {
            const chunkedMeals = chunk(shuffledMeals, 7);
            week1 = chunkedMeals[ 0 ];
            week2 = chunkedMeals[ 1 ];
            week3 = chunkedMeals[ 2 ];
            week4 = chunkedMeals[ 3 ];
        }
    }
    if (type === "Manual") {
        week1 = data.week1;
        week2 = data.week2;
        week3 = data.week3;
        week4 = data.week4;
    }

    const ingredientListFormat = (week) => {

        let ingredientList = [];
        week.map(meal => {
            ingredientList = concat(ingredientList, meal.main.ingredients, meal.side1.ingredients, meal.side2.ingredients);
        });
        const formattedList = ingredientList.map(ingredient => {
            let totalAmount;
            if (ingredient.fraction) {
                totalAmount = math.fraction(ingredient.fraction) + ingredient.quantity;
            } else {
                totalAmount = ingredient.quantity;
            }
            return { name: ingredient.name, amount: totalAmount, unit: ingredient.unit };
        });

        const reducedList = formattedList.reduce((acc, { name, amount, unit }) => {
            if (!acc[ name ]) {
                acc[ name ] = { name, amount: 0, unit };
            }
            const convertedAmount = math.format(math.unit(amount, unit).to(unit).toNumber(), { precision: 4 });
            acc[ name ].amount = add(acc[ name ].amount, convertedAmount);
            return acc;
        }, {});

        const flattenedList = Object.values(reducedList).map(ingredient => {
            const onlyForConversion = [ "milk", "juice", "oil", "cider", "vinegar", "water" ];
            const lowerCaseName = ingredient.name.toLowerCase().trim();
            const hasMatch = onlyForConversion.some(term => lowerCaseName.includes(term));

            switch (ingredient.unit) {
                case "teaspoon":
                    if (ingredient.amount >= 3 && ingredient.amount < 48) {
                        ingredient.amount = math.format(math.unit(ingredient.amount, ingredient.unit).to("tablespoon").toNumber(), { precision: 2 });
                        ingredient.unit = "tablespoon";
                    } else if (ingredient.amount >= 48) {
                        ingredient.amount = math.format(math.unit(ingredient.amount, ingredient.unit).to("cup").toNumber(), { precision: 2 });
                        ingredient.unit = "cup";
                    }
                    break;
                case "tablespoon":
                    if (ingredient.amount >= 16) {
                        ingredient.amount = math.format(math.unit(ingredient.amount, ingredient.unit).to("cup").toNumber(), { precision: 2 });
                        ingredient.unit = "cup";
                    }
                    break;
                case "cup":
                    if (hasMatch) {
                        if (ingredient.amount >= 2 && ingredient.amount < 4) {
                            ingredient.amount = math.format(math.unit(ingredient.amount, ingredient.unit).to("pint").toNumber(), { precision: 2 });
                            ingredient.unit = "pint";
                        } else if (ingredient.amount >= 4 && ingredient.amount < 16) {
                            ingredient.amount = math.format(math.unit(ingredient.amount, ingredient.unit).to("quart").toNumber(), { precision: 2 });
                            ingredient.unit = "quart";

                        } else if (ingredient.amount >= 16) {
                            ingredient.amount = math.format(math.unit(ingredient.amount, ingredient.unit).to("gallon").toNumber(), { precision: 2 });
                            ingredient.unit = "gallon";
                        }
                    }
                    break;
                case "pint":
                    if (ingredient.amount >= 2 && ingredient.amount < 8) {
                        ingredient.amount = math.format(math.unit(ingredient.amount, ingredient.unit).to("quart").toNumber(), { precision: 2 });
                        ingredient.unit = "quart";
                    } else if (ingredient.amount >= 8) {
                        ingredient.amount = math.format(math.unit(ingredient.amount, ingredient.unit).to("gallon").toNumber(), { precision: 2 });
                        ingredient.unit = "gallon";
                    }
                    break;
                case "quart":
                    if (ingredient.amount >= 4) {
                        ingredient.amount = math.format(math.unit(ingredient.amount, ingredient.unit).to("gallon").toNumber(), { precision: 2 });
                        ingredient.unit = "gallon";
                    }
                    break;
                case "oz":
                    if (ingredient.amount >= 16) {
                        ingredient.amount = math.format(math.unit(ingredient.amount, ingredient.unit).to("lb").toNumber(), { precision: 2 });
                        ingredient.unit = "lb";
                    }
                    break;
                default:
                    break;
            }
            return `${ ingredient.amount } ${ ingredient.unit }${ ingredient.amount >= 1 ? "s" : "" } of ${ ingredient.name }`;
        });
        return flattenedList;
    };

    const mealPlan = {
        week1: {
            meals: week1,
            list: ingredientListFormat(week1)
        },
        week2: {
            meals: week2,
            list: ingredientListFormat(week2)
        },
        week3: {
            meals: week3,
            list: ingredientListFormat(week3)
        },
        week4: {
            meals: week4,
            list: ingredientListFormat(week4)
        }
    };

    return mealPlan;
};

module.exports = handleMealPlan;