import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const HabitTrackerScreen = () => {
  const [habit, setHabit] = useState('');
  const [habits, setHabits] = useState([]);

  const addHabit = () => {
    setHabits([...habits, habit]);
    setHabit('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your habit"
        value={habit}
        onChangeText={setHabit}
      />
      <Button title="Add Habit" onPress={addHabit} />
      <View style={styles.habitsList}>
        {habits.map((habit, index) => (
          <Text key={index} style={styles.habitText}>{habit}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingLeft: 10 },
  habitsList: { marginTop: 20 },
  habitText: { fontSize: 18 }
});

export default HabitTrackerScreen;
