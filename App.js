import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {useState, useEffect} from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import { View, Button, Text, StyleSheet, ActivityIndicator, Image, Linking} from 'react-native';
import { FlatList, TextInput} from 'react-native-gesture-handler';


let MyCity = "";
function Home({navigation}){
  const [value, onChangeText] = React.useState('Enter city here');
  return(
    
    <View style = {styles.container}>
     <Button
    title="Go to News List"
    onPress={() => navigation.navigate('News List')}
    />
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => onChangeText(text)}
      value={value}
    />
    <Button
    title="Set City"
    onPress={() => MyCity = value}
    />
     <Button
    title="Go to Weather"
    onPress={() => navigation.navigate('Weather')}
    />
    </View>
  );
}

function NewsList(){
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://newscatcher.p.rapidapi.com/v1/latest_headlines?lang=en&media=True", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "9bbc9326d3msha21930f500bfb76p19b110jsn3e0b091908ad",
		"x-rapidapi-host": "newscatcher.p.rapidapi.com"
	}})
    .then((response) => response.json())
    .then((json) => setData(json.articles))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
  }, []);
    return (
      <View style={styles.container}>
        {isLoading ? <ActivityIndicator/> : (
         <FlatList
         data={data}
         keyExtractor={({ id }, _id) => id}
         renderItem={({ item }) => (

           <View style={{marginBottom:15, backgroundColor: "#ccc"}}>
            <Image source={{uri : item.urlToImage}} style = {styles.image}/>
            <Text style = {styles.headline}>{item.title}</Text>
         <Text>{item.summary}</Text>
            <Button
              title="Go to Article"
              onPress={() => Linking.openURL(item.link)}
            />
           </View>
          )}
        />
      )}

      </View>
    );
  
}

function Weather(){
  const [info,setInfo] = useState({
    name:"loading",
    temp:"loading",
    humidity:"loading",
    desc:"loading"
})
    
    useEffect(()=>{
     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${MyCity}&APPID=4b6ce950c31a384418cc664531af29c6&units=metric`)
     .then(data=>data.json())
     .then(results=>{
        setInfo({
            name: results.name,
            temp: results.main.temp,
            humidity: results.main.humidity,
            desc: results.weather[0].description

        })
     })
     .catch(err=>{
         alert(err.message)
     })
    })
    return(
        <View style={{flex:1}}>
           <View style={{alignItems:"center"}}>
           
               <Text
               style={{
                   color:'#00aaff',
                   marginTop:30,
                   fontSize:30
               }}>
                   {info.name}
               </Text>
           </View>
           <Text style={{color:"#00aaff"}}>Temperature is: {info.temp}</Text>
          
           <Text style={{color:"#00aaff"}}>Humidity is: {info.humidity}</Text>
      
           <Text style={{color:"#00aaff"}}>Description is:  {info.desc}</Text>
        </View>
    )
}
const Stack = createStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options= {{title: 'Home'}}
                   
        />
        <Stack.Screen name="News List"
        component={NewsList}
        options= {{title: 'News List'}} 
        />
         <Stack.Screen name="Weather"
        component={Weather}
        options= {{title: 'Weather'}} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
      alignItems: 'stretch',
      justifyContent: 'flex-start'
  },
  headline: {
    textAlign: 'center',
    textAlignVertical: 'bottom',
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 0
  },
  image: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 150,
  },
});