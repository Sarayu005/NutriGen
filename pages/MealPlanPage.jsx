import React, { useState } from 'react';
import axios from 'axios';
import './MealPlanPage.css'; // Import the CSS file

const MealPlanPage = () => {
    const [preferences, setPreferences] = useState({
        dietaryRestrictions: '',
        allergies: '',
        healthConditions: '',
        activityLevel: '',
        calorieGoal: '',
        age: '',
        budget: '',
    });
    const [mealPlan, setMealPlan] = useState(null);

    const handleGenerateMealPlan = async () => {
        try {
            const response = await axios.post('http://localhost:5005/api/mealplan', { preferences });
            setMealPlan(response.data.mealPlan); // Access the mealPlan string
        } catch (error) {
            console.error('Error generating meal plan:', error);
        }
    };

    // Function to format the meal plan data into HTML
    const formatMealPlan = (data) => {
        return data.split('\n').map((line, index) => {
            if (line.startsWith('## ')) {
                // Main heading
                return <h2 key={index} className="main-heading">{line.replace('## ', '')}</h2>;
            } else if (line.startsWith('**') && line.endsWith('**')) {
                // Subheadings
                return <h3 key={index} className="sub-heading">{line.replace(/\*\*/g, '')}</h3>;
            } else if (line.startsWith('* ')) {
                // List items
                return <li key={index} className="list-item">{line.replace('* ', '')}</li>;
            } else if (line.trim() === '') {
                // Empty lines (add spacing)
                return <br key={index} />;
            } else {
                // Regular paragraphs
                return <p key={index} className="paragraph">{line}</p>;
            }
        });
    };

    return (
        <div className="meal-plan-container">
            <h2 className="page-title">Generate Meal Plan</h2>
            <div className="preferences-form">
                <input
                    type="text"
                    placeholder="Dietary Restrictions"
                    value={preferences.dietaryRestrictions}
                    onChange={(e) => setPreferences({ ...preferences, dietaryRestrictions: e.target.value })}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Allergies"
                    value={preferences.allergies}
                    onChange={(e) => setPreferences({ ...preferences, allergies: e.target.value })}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Health Conditions"
                    value={preferences.healthConditions}
                    onChange={(e) => setPreferences({ ...preferences, healthConditions: e.target.value })}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Activity Level"
                    value={preferences.activityLevel}
                    onChange={(e) => setPreferences({ ...preferences, activityLevel: e.target.value })}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Calorie Goal"
                    value={preferences.calorieGoal}
                    onChange={(e) => setPreferences({ ...preferences, calorieGoal: e.target.value })}
                    className="form-input"
                />
                  <input
                    type="number"
                    placeholder="Age"
                    value={preferences.age}
                    onChange={(e) => setPreferences({ ...preferences, age: e.target.value })}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Budget (e.g., $50/week)"
                    value={preferences.budget}
                    onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
                    className="form-input"
                />
                <button onClick={handleGenerateMealPlan} className="generate-button">
                    Generate Meal Plan
                </button>
            </div>
            {mealPlan && (
                <div className="meal-plan-results">
                    <h3 className="results-title">Your Meal Plan</h3>
                    <div className="meal-plan-content">
                        {formatMealPlan(mealPlan)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealPlanPage;