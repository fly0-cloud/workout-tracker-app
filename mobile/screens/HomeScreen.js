import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getTodayWorkout, startWorkout } from '../redux/slices/workoutSlice';
import { getPlans } from '../redux/slices/planSlice';
import MaterialIcons from '@react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { todayWorkouts, loading } = useSelector(state => state.workouts);
  const { plans } = useSelector(state => state.plans);

  useEffect(() => {
    dispatch(getTodayWorkout());
    dispatch(getPlans());
  }, [dispatch]);

  const handleStartWorkout = (planId) => {
    dispatch(startWorkout(planId)).then(action => {
      if (action.payload) {
        navigation.navigate('TrackWorkout', { workoutId: action.payload.workoutId });
      }
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>Today's Workout</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      ) : todayWorkouts.length > 0 ? (
        <FlatList
          data={todayWorkouts}
          keyExtractor={(item) => item.workoutId}
          renderItem={({ item }) => (
            <View style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutStatus}>Status: {item.status}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? '#4CAF50' : '#FF9800' }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.exerciseCount}>
                📋 {item.exercises.length} exercises
              </Text>
              {item.status !== 'completed' && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => navigation.navigate('TrackWorkout', { workoutId: item.workoutId })}
                >
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                  <Text style={styles.completeButtonText}>Continue Workout</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="fitness-center" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No workout scheduled</Text>
          <Text style={styles.emptySubText}>Select a plan to start your workout</Text>
        </View>
      )}

      {plans.length > 0 && todayWorkouts.length === 0 && (
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Available Plans</Text>
          <FlatList
            data={plans.slice(0, 3)}
            keyExtractor={(item) => item.planId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.planCard}
                onPress={() => handleStartWorkout(item.planId)}
              >
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{item.name}</Text>
                  <Text style={styles.planExercises}>{item.exercises.length} exercises</Text>
                </View>
                <MaterialIcons name="play-circle-filled" size={30} color="#667eea" />
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutStatus: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  exerciseCount: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  completeButton: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  plansSection: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  planCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  planExercises: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default HomeScreen;
