import React from 'react';
import {Pressable, StyleSheet, TextInput} from 'react-native';
import { View,Text,TouchableOpacity,Image } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { fetch } from 'expo/fetch';
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";


const SignUp = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name ,setName] = useState();
    const [mobile,setMobile] = useState();
    const data ={
        email : emailOrUsername,
        password :password,
        name : name,
        mobile_number : mobile,
    }


const login = async (email, password) => {
    const auth = getAuth();
    try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/(main)/MapPage');
    } catch (error) {
        console.log(error.code, error.message);
    }
};

const SignUp = async () => {
    console.log(apiUrl)
    try {
        const response = await fetch(`${apiUrl}/users/register`, {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Registration failed:', response.status, errorText);
            return;
        }

        const result = await response.json();
        console.log('Registration successful:', result);
        await login(emailOrUsername, password);
    } catch (error) {
        console.error('Network or other error:', error);
    }
};



    return (
        <SafeAreaView style={styles.safeAreaContainer}>
                <Text style={styles.pageHeader}>Sign Up</Text>
                
                <TextInput
                    style={styles.input}
                    onChangeText={setEmailOrUsername}
                    value={emailOrUsername}
                    placeholder="Email or Username"
                    keyboardType="email-address" 
                    autoCapitalize="none"
                    placeholderTextColor={"gray"}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                    placeholder="name"
                    keyboardType="email-address" 
                    autoCapitalize="none"
                    placeholderTextColor={"gray"}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setMobile}
                    value={mobile}
                    placeholder="mobile-number"
                    keyboardType="email-address" 
                    autoCapitalize="none"
                    placeholderTextColor={"gray"}
                />
            
                {/* Password input */}
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry={true} 
                    placeholderTextColor={"gray"}
                />

                <TouchableOpacity
                    onPress={() => SignUp()}
                    style={{
                        marginTop: 30,
                        width: '80%',
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#2196F3',
                        borderRadius: 6,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                        elevation: 5,
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Sign Up</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>Or, Sign Up with</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <Image 
                        source={require('../../assets/images/google-logo.png')}   // your Google logo
                        style={styles.socialIcon}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                    <Image 
                        source={require('../../assets/images/facebook-logo-2.png')}  // your Facebook logo
                        style={styles.socialIcon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={{marginTop: 40, color: '#888'}}>Already have an account</Text>
            <Pressable
                    onPress={()=> SignUp}
                    style={{
                        marginTop: 30,
                        width: '80%',
                        height: 40,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                        elevation: 5,
                    }}
                    
                >
                <Text style={{color: '#2196F3', fontWeight: 'bold',fontSize: 20}}>Log in </Text>
            </Pressable>

        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    pageHeader: {
        color: '#2196F3',
        fontSize: 30,
        fontWeight: 'bold',
        margin: 20,
        alignSelf: 'center',
    },
    safeAreaContainer: {
        flex: .8,
        margin: 20,
        alignItems: 'center',
        alignContent: 'center',
    },
    input: {
        marginTop: 20,
        height: 50,
        width: '80%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: '#cccccc',
        fontSize: 18,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginVertical: 20,
    },

    line: {
        flex: 1,                    
        height: 1,
        backgroundColor: '#d0d0d0', 
    },

    dividerText: {
        marginHorizontal: 10,
        color: '#888',
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 20, // spacing between buttons
    },

    socialButton: {
        width: 60,
        height: 60,
        backgroundColor: 'white',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // shadow for Android
        shadowColor: '#000', // shadow for iOS
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },

    socialIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
});

export default SignUp;