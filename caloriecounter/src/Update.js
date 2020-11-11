import * as R from 'ramda';

const MSGS = {
  SHOW_FORM: 'SHOW_FORM',
  MEAL_INPUT: 'MEAL_INPUT',
  CALORIES_INPUT: 'CALORIES_INPUT',
  SAVE_MEAL: 'SAVE_MEAL',
  DELETE_MEAL: 'DELETE_MEAL',
  EDIT_MEAL: 'EDIT_MEAL',
};

export const saveMealMsg = {
  type: MSGS.SAVE_MEAL,
};

export function editMealMsg(editId) {
  return {
    type: MSGS.EDIT_MEAL,
    editId,
  };
}

export function deleteMealMsg(id) {
  return {
    type: MSGS.DELETE_MEAL,
    id,
  };
}

export function showFormMsg(showForm) {
  return {
    type: MSGS.SHOW_FORM,
    showForm,
  };
}

export function mealInputMsg(description) {
  return {
    type: MSGS.MEAL_INPUT,
    description,
  };
}

export function caloriesInputMsg(calories) {
  return {
    type: MSGS.CALORIES_INPUT,
    calories,
  };
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.SHOW_FORM:
      const { showForm } = msg;
      return { ...model, showForm, description: '', calories: 0 };
    case MSGS.MEAL_INPUT:
      const { description } = msg;
      return { ...model, description };
    case MSGS.CALORIES_INPUT:
      const calories = R.pipe(parseInt, R.defaultTo(0))(msg.calories);
      return { ...model, calories };
    case MSGS.SAVE_MEAL:
      const { editId } = model;
      const updatedModel = editId === null ? addMeal(model) : updateMeal(model);
      return updatedModel;
    case MSGS.DELETE_MEAL:
      return removeMeal(msg, model);
    case MSGS.EDIT_MEAL:
      return editMeal(msg, model);
    default:
      return model;
  }
  return model;
}

function updateMeal(model) {
  const { description, calories, editId } = model;
  const meals = R.map((meal) => {
    if (meal.id === editId) {
      return { ...meal, description, calories };
    }
    return meal;
  }, model.meals);
  return {
    ...model,
    meals,
    description: '',
    calories: 0,
    showForm: false,
    editId: null,
  };
}

function editMeal(msg, model) {
  const { editId } = msg;
  const meal = R.find((meal) => meal.id === editId, model.meals);
  const { description, calories } = meal;
  return {
    ...model,
    editId,
    description,
    calories,
    showForm: true,
  };
}

function removeMeal(msg, model) {
  const { id } = msg;
  const meals = R.filter((meal) => meal.id !== id, model.meals);
  return { ...model, meals };
}

function addMeal(model) {
  const { nextId, description, calories } = model;
  const meal = { id: nextId, description, calories };
  const meals = [...model.meals, meal];
  return {
    ...model,
    meals,
    nextId: nextId + 1,
    description: '',
    calories: 0,
    showForm: false,
  };
}

export default update;
