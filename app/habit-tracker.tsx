import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Circle } from 'react-native-svg';


export default function HabitTrackerScreen() {
  const [habits, setHabits] = useState<{ name: string; dates: { [key: string]: boolean } }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());


  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);
  

  // Загружаем привычки из AsyncStorage
  const loadHabits = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem('habits');
      if (savedHabits) {
        const habitsData = JSON.parse(savedHabits);
        // Убедимся, что каждый элемент в habits — это объект с правильной структурой
        const correctedHabits = habitsData.map((habit: any) => {
          if (typeof habit === 'string') {
            return { name: habit, dates: {} }; // Если это строка, преобразуем в правильный формат
          }
          return habit;
        });
        setHabits(correctedHabits || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки привычек:', error);
    }
  };

  // Сохраняем привычки в AsyncStorage
  const saveHabits = async (updatedHabits: { name: string; dates: { [key: string]: boolean } }[]) => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
    } catch (error) {
      console.error('Ошибка сохранения привычек:', error);
    }
  };

  // Добавляем новую привычку
  const addHabit = () => {
    if (newHabit.trim()) {
      const updatedHabits = [...habits, { name: newHabit, dates: {} }];
      setHabits(updatedHabits);
      saveHabits(updatedHabits);
      setNewHabit('');
      setModalVisible(false);
    }
  };

// Отмечаем привычку выполненной на текущую дату
const toggleHabit = (index: number) => {
  const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000) 
    .toISOString().split("T")[0]; // Поправка на часовой пояс

  console.log(`Отмечаю дату: ${localDate}`); // Логируем, чтобы понять, какая дата отмечается

  const updatedHabits = [...habits];

  if (!updatedHabits[index].dates) {
    updatedHabits[index].dates = {};
  }

  updatedHabits[index].dates[localDate] = !updatedHabits[index].dates[localDate];
  setHabits(updatedHabits);
  saveHabits(updatedHabits);
};

// Проверка, выполнена ли привычка на выбранную дату
const isHabitDoneOnDate = (habit: { dates: { [key: string]: boolean } }) => {
  const dateKey = selectedDate.toISOString().split("T")[0];
  // Убедимся, что объект "dates" существует перед обращением к свойствам
  return habit.dates && habit.dates[dateKey] || false;
};

// Проверка, выполнена ли привычка на выбранные даты недели
const isHabitCompletedOnDay = (habit: { dates: { [key: string]: boolean } }, day: string) => {
  return habit.dates && habit.dates[day] === true; // Возвращает true, если привычка выполнена для конкретной даты
};

//Подсчет % выполненных привычек
const completedHabits = habits.filter(isHabitDoneOnDate).length;
const totalHabits = habits.length;
const percentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

// Изменение даты
const changeDate = (days: number) => {
  const newDate = new Date(selectedDate);
  newDate.setDate(newDate.getDate() + days);
  setSelectedDate(newDate);
}

// Получение начала и конца недели
const getStartAndEndOfWeek = (date: Date) => {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay(); // 0 (вс), 1 (пн), ..., 6 (сб)

  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Делаем пн первым днем недели
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { start: startOfWeek, end: endOfWeek };
};

// Функция для получения данных по конкретной неделе (например, 20.01 - 26.01)
const getWeekDates = (selectedDate: Date) => {
  const { start } = getStartAndEndOfWeek(selectedDate);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date.toISOString().split('T')[0]; // Преобразуем в формат YYYY-MM-DD
  });
};

// Получаем даты недели для выбранной даты (например, текущая или выбранная пользователем)
const selectedWeekDates = getWeekDates(selectedDate); // selectedDate - это текущая или выбранная пользователем дата

// Переключение недели
const changeWeek = (direction: number) => {
  const newDate = new Date(selectedDate);
  newDate.setDate(newDate.getDate() + direction * 7);
  setSelectedDate(newDate);
};

//Форматирование даты в формат дд.мм
const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
};


return (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    
    {/* Дата */}
    <View style={styles.dateContainer}>
      <TouchableOpacity onPress={() => changeDate(-1)}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

    <Text style={styles.dateText}>
      {selectedDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
    </Text>

    <TouchableOpacity onPress={() => changeDate(1)}>
      <Ionicons name="chevron-forward" size={24} color="black" />
    </TouchableOpacity>
  </View>


    {/* Диаграмма выполненных привычек*/}
    <View style={styles.chartContainer}>
      <Svg height="100" width="100" viewBox="0 0 36 36">
      {/* Фон диаграммы (серый круг) */}
      <Circle cx="18" cy="18" r="15.5" stroke="#d3d3d3" strokeWidth="3" fill="none" />

      {/* Заполненная часть диаграммы (зеленый сегмент) */}
      <Circle
        cx="18"
        cy="18"
        r="15.5"
        stroke="#28a745"
        strokeWidth="3"
        fill="none"
        strokeDasharray={`${percentage}, 100`}
       strokeLinecap="round"
       transform="rotate(-90 18 18)"
      />
    </Svg>
    <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
  </View>

    {/* Список привычек */}
    <FlatList
      data={habits}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.habitItem}>
          <Text style={styles.habitText}>{item.name}</Text>
          <TouchableOpacity 
            style={[styles.checkButton, isHabitDoneOnDate(item) ? styles.done : styles.notDone]} 
            onPress={() => toggleHabit(index)}
          >
          {isHabitDoneOnDate(item) ? (
           <Ionicons name="checkmark" size={24} color="white" />
          ) : (
          <Ionicons name="remove" size={24} color="white" />
  )}
          </TouchableOpacity>
        </View>
      )}
    />

    {/* Статистика за неделю */}
    <View style={styles.weeklyStatsContainer}>
        
      <View style={styles.weeklyHeader}>
        <TouchableOpacity onPress={() => changeWeek(-1)}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.weeklyTitleContainer}>
          <Text style={styles.weeklyTitle}>неделя</Text>
          {
            (() => {
              const { start, end } = getStartAndEndOfWeek(selectedDate);
              const startDate = formatDate(start);
              const endDate = formatDate(end);
              return <Text style={styles.weeklyDateRange}>{startDate} - {endDate}</Text>;
            })()
          }
        </View>
        <TouchableOpacity onPress={() => changeWeek(1)}>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

        <View style={styles.weeklyTable}>
          {/* Заголовки столбцов */}
          <View style={styles.weeklyRow}>
            <Text style={styles.weeklyCell}> </Text>
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
              <Text key={index} style={styles.weeklyCell}>{day}</Text>
          ))}
        <Text style={styles.weeklyCell}>Ф</Text>
        <Text style={styles.weeklyCell}>Ц</Text>
      </View>

      {/* Строки с привычками */}
      {habits.map((habit, habitIndex) => {
        const completedDays = selectedWeekDates.filter(day => habit.dates && habit.dates[day]);
        const completedCount = completedDays.length;

        return (
          <View key={habitIndex} style={styles.weeklyRow}>
            <Text style={styles.weeklyCell}>{habit.name}</Text>
            
            {/* Отображаем статус привычки для каждого дня недели */}
            {selectedWeekDates.map((day, index) => {
              const isChecked = habit.dates && habit.dates[day];
              return (
                <Text key={index} style={styles.weeklyCell}>
                  {isChecked ? (
                    <Ionicons name="checkmark" size={18} color="#28a745" /> // Галочка, если привычка выполнена
                  ) : (
                  <Text style={styles.missedSymbol}>✖</Text>
                )}
            </Text>
          );
        })}
            <Text style={styles.weeklyCell}>{completedCount}</Text>
            <Text style={styles.weeklyCell}>5</Text> {/* Здесь можно задать индивидуальную цель */}
          </View>
        );
      })}
    </View>
  </View>
  </ScrollView>

      {/* Кнопка + в правом нижнем углу */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={36} color="white" />
      </TouchableOpacity>

      {/* Модальное окно для ввода привычки */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить привычку</Text>
            <TextInput
              style={styles.input}
              placeholder="Название привычки"
              value={newHabit}
              onChangeText={setNewHabit}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={addHabit}>
                <Text style={styles.buttonText}>Сохранить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,  // Это свойство помогает ScrollView растягиваться на весь экран
    paddingBottom: 20, // Если нужно немного отступить внизу
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  habitText: {
    fontSize: 18,
    flex: 1,
  },
  checkButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  done: {
    backgroundColor: '#28a745',
  },
  notDone: {
    backgroundColor: '#dc3545',
  },
  checkButtonText: {
    color: 'white',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  percentageText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },  
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },  
  weeklyStatsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  weeklyStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  weeklyTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  weeklyCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },  
  missedSymbol: {
    color: '#808080',  // Серый цвет
    fontSize: 14,      // Уменьшенный размер шрифта
  },
  weeklyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  weeklyTitleContainer: {
    alignItems: 'center',
  },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weeklyDateRange: {
    fontSize: 14,
    color: '#555',
  },
});
