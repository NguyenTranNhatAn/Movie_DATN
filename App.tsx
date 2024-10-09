
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

import Latest from './src/screens/Latest'
import Favour from './src/screens/Favour'
import Search from './src/screens/Search';
import Profile from './src/screens/Profile';
import Detail from './src/screens/Detail';
function App(): React.JSX.Element {
  return (
  
    <SafeAreaView style={{flex:1 }}>
      <StatusBar />
<View>


</View>
<Latest></Latest>

    </SafeAreaView>
    
  );
}


export default App;
