import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoalTrackerScreen = () => {
  const [goal, setGoal] = useState('');
  const [goals, setGoals] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // Добавлено состояние для индекса редактирования
  const [editedText, setEditedText] = useState(''); // Добавлено состояние для текста редактирования

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem('goals');
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Ошибка загрузки целей:', error);
    }
  };

  const saveGoals = async (newGoals) => {
    try {
      await AsyncStorage.setItem('goals', JSON.stringify(newGoals));
    } catch (error) {
      console.error('Ошибка сохранения целей:', error);
    }
  };

  const addGoal = () => {
    if (goal.trim() === '') return;
    const newGoals = [...goals, goal];
    setGoals(newGoals);
    saveGoals(newGoals);
    setGoal('');
  };

  const deleteGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedText(goals[index]);
  };

  const saveEdit = () => {
    if (editedText.trim() === '') return;
    const updatedGoals = goals.map((item, index) =>
      index === editingIndex ? editedText : item
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    setEditingIndex(null);
    setEditedText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Трекер целей</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите цель"
        value={goal}
        onChangeText={setGoal}
      />
      <Button title="Добавить цель" onPress={addGoal} />
      <FlatList
        data={goals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.goalContainer}>
            {editingIndex === index ? (
              <TextInput
                style={styles.editInput}
                value={editedText}
                onChangeText={setEditedText}
              />
            ) : (
              <Text style={styles.goalText}>{item}</Text>
            )}

            {editingIndex === index ? (
              <TouchableOpacity onPress={saveEdit} style={styles.saveButton}>
                <Text style={styles.buttonText}>💾</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity onPress={() => startEditing(index)} style={styles.editButton}>
                  <Text style={styles.buttonText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteGoal(index)} style={styles.deleteButton}>
                  <Text style={styles.buttonText}>❌</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  goalText: {
    fontSize: 18,
    flex: 1,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    flex: 1,
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default GoalTrackerScreen;
