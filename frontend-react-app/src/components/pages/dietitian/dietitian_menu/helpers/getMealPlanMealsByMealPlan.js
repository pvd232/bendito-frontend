export const getMealPlanMealsByMealPlan = (mealPlanMeals) => {
  if (mealPlanMeals) {
    const mealPlanMealMap = new Map();
    mealPlanMeals.forEach((mealPlanMeal) => {
      if (mealPlanMealMap.has(mealPlanMeal.mealPlanId)) {
        mealPlanMealMap.get(mealPlanMeal.mealPlanId).push(mealPlanMeal);
      } else {
        mealPlanMealMap.set(mealPlanMeal.mealPlanId, [mealPlanMeal]);
      }
    });
    return mealPlanMealMap;
  } else {
    return false;
  }
};
