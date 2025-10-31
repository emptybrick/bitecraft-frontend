import { useState, useEffect, useContext } from "react";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import Message from "../../Component/Message/Message";
import PageHeader from "../../Component/Header/PageHeader";
import Filter from "../../Component/Filter/Filter";

const MealCollection = () => {
  const { user } = useContext(UserContext);
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchAllMeals = async () => {
      const mealsData = await biteCraftService.Index(
        "MealCollection",
        user._id
      );
      if (mealsData) {
        setMeals(mealsData);
      }
      setIsLoading(false);
    };
    if (user) fetchAllMeals();
  }, [user]);


  if (!user || isLoading) return <ProgressBar />;

  return (
    <div className="section">
      <PageHeader userName={user.username} headerText={"Meals Collection"} />
      <div className="container">
        {meals.length > 0 ? (
          <Filter items={meals} type={"Meal"} setItems={setMeals} itemCollection={meals} />
        ) : (
          <Message itemName={"Meal"} />
        )}
      </div>
    </div>
  );
};

export default MealCollection;
