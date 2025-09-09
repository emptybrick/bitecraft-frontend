import { useState, useEffect, useContext } from "react";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import PageHeader from "../../Component/Header/PageHeader";
import Filter from "../../Component/Filter/Filter";

const MealList = () => {
  const { user } = useContext(UserContext);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchAllMeals = async () => {
      const mealsData = await biteCraftService.Index("Meal");
      const filteredMeals = mealsData.filter(
        (meal) => meal.main && meal.side1 && meal.side2
      );
      setMeals(filteredMeals);
    };
    if (user) fetchAllMeals();
  }, [user]);

  if (!user || !meals) return <ProgressBar />;

  return (
    <div className="section">
      <div className="container">
        <PageHeader headerText={"List of all Meals"} />
        <Filter items={meals} type={"Meal"} setItems={setMeals} />
      </div>
    </div>
  );
};

export default MealList;
