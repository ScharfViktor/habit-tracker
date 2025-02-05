import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import HomeScreen from '../../app/home';
import HabitTrackerScreen from '../../app/habit-tracker';
import GoalTrackerScreen from '../../app/goal-tracker';
import DiaryScreen from '../../app/diary';
import AnalyticsScreen from '../../app/analytics';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Домой') {
            return <MaterialIcons name="home" size={size} color={color} />;
          } else if (route.name === 'Трекер привычек') {
            return <Ionicons name="checkbox-outline" size={size} color={color} />;
          } else if (route.name === 'Цели') {
            return <Feather name="target" size={size} color={color} />;
          } else if (route.name === 'Дневник') {
            return <MaterialIcons name="book" size={size} color={color} />;
          } else if (route.name === 'Аналитика') {
            return <Ionicons name="bar-chart" size={size} color={color} />;
          }
        },
        tabBarShowLabel: false, // Убираем подписи под иконками
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Домой" component={HomeScreen} />
      <Tab.Screen name="Трекер привычек" component={HabitTrackerScreen} />
      <Tab.Screen name="Цели" component={GoalTrackerScreen} />
      <Tab.Screen name="Дневник" component={DiaryScreen} />
      <Tab.Screen name="Аналитика" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}
