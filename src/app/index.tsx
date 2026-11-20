import {Image, Button,Text, View, StyleSheet, ScrollView, Alert } from "react-native";

export default function Index() {
  return (
    <ScrollView>


      {[...Array(40)].map((_, i) => (
        <Text key={i} style={{padding:20, margin:3,backgroundColor:'#2276ae', borderRadius: 2, }}>
          Item{i}
        </Text>
      ))}
      <Button title="Press Me" color="#4f4542" onPress={() => Alert.alert("Pressed this button son, welldone brother")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
     backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },
});