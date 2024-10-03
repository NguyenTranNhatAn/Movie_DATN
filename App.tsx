
import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import Latest from './src/Latest'
import Favour from './src/Favour'
import Search from './src/Search';
import Profile from './src/Profile';
function App(): React.JSX.Element {
  return (
  
    <SafeAreaView style={{flex:1 }}>
      <StatusBar />
<View>


</View>
<Profile></Profile>

    </SafeAreaView>
    
  );
}


export default App;
