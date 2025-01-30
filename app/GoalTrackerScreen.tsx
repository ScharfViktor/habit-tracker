import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Goal {
  goal: string;
  duration: 'short' | 'medium' | 'long';
}

const GoalTrackerScreen: React.FC = () => {
  const [goal, setGoal] = useState<string>('');
  const [goalDuration, setGoalDuration] = useState<'short' | 'medium' | 'long'>('short');
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = () => {
    setGoals([...goals, { goal, duration: goalDuration }]);
    setGoal('');
    setGoalDuration('short');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goal Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your goal"
        value={goal}
        onChangeText={setGoal}
      />
      <Picker
        selectedValue={goalDuration}
        style={styles.picker}
        onValueChange={(itemValue) => setGoalDuration(itemValue as 'short' | 'medium' | 'long')}
      >
        <Picker.Item label="Short-term (1 week)" value="short" />
        <Picker.Item label="Medium-term (1 month)" value="medium" />
        <Picker.Item label="Long-term (1 year)" value="long" />
      </Picker>
      <Button title="Add Goal" onPress={addGoal} />
      <View style={styles.goalsList}>
        {goals.map((goal, index) => (
          <Text key={index} style={styles.goalText}>
            {goal.goal} ({goal.duration})
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingLeft: 10 },
  picker: { height: 50, width: 150, marginBottom: 20 },
  goalsList: { marginTop: 20 },
  goalText: { fontSize: 18 }
});

export default GoalTrackerScreen;