import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../helper/login'; // Pastikan path sesuai

const DetailCio = ({ route }) => {
  const { item } = route.params;
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT fullname AS name, type_id AS jabatan FROM user ORDER BY id DESC LIMIT 1',
        [],
        (txObj, resultSet) => {
          if (resultSet.rows.length > 0) {
            const user = resultSet.rows.item(0);
            setUserInfo(user);
          }
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    });
  }, []);

  const getWorkDuration = (start, end) => {
    if (!start || !end) return '-';
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const startMinutes = h1 * 60 + m1;
    const endMinutes = h2 * 60 + m2;
    const diff = endMinutes - startMinutes;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours} jam ${minutes} menit`;
  };

  const timeIn = item.datetimephone_in?.split(' ')[1] || '-';
  const timeOut = item.datetimephone_out?.split(' ')[1] || '-';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.customer_name}</Text>
        <Text style={styles.date}>{item.date_cio}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Nama</Text>
          <Text style={styles.value}>{userInfo.name || '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Jabatan</Text>
          <Text style={styles.value}>{userInfo.jabatan || '-'}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.timeRow}>
            <Icon name="clock-in" size={20} color="#007AFF" style={styles.icon} />
            <Text style={styles.label}>Jam Check-in</Text>
          </View>
          <Text style={styles.value}>{timeIn}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.timeRow}>
            <Icon name="clock-out" size={20} color="#007AFF" style={styles.icon} />
            <Text style={styles.label}>Jam Check-out</Text>
          </View>
          <Text style={styles.value}>{timeOut}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.timeRow}>
            <Icon name="timer-outline" size={20} color="#007AFF" style={styles.icon} />
            <Text style={styles.label}>Jam Kerja</Text>
          </View>
          <Text style={styles.value}>{getWorkDuration(timeIn, timeOut)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
});

export default DetailCio;
