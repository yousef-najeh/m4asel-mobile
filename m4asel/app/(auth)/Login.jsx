import React from 'react';
import {Pressable, StyleSheet, TextInput} from 'react-native';
import { View,Text,TouchableOpacity,Image } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useState } from 'react';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { router } from 'expo-router';
import { I18nManager } from "react-native";
import {auth} from "../../util/fireBaseConfig"
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import { Formik, ErrorMessage } from 'formik';
import { Button, ButtonText } from '@/components/ui/button';

import * as Yup from 'yup';
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);




const Login = () => {
    const [checked, setChecked] = useState(false);

        const login = async (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Logged in:", userCredential.user.email);
                console.log(getAuth().currentUser.accessToken);
                router.push("../(main)/MapPage");
            })
            .catch((error) => {
                console.log(error.code, error.message);
            });
        };

    return (
    <SafeAreaProvider style={styles.safeAreaProviderContainer}> 
        <SafeAreaView style={styles.safeAreaContainer}>
        <Text style={styles.pageHeader}>Log in </Text>
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={
                Yup.object().shape({
                email: Yup.string().email('Invalid email').required('Email is required'),
                password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
                })
            }
            onSubmit={async (values)  => {
                await login(values.email, values.password);
            }}>
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={{ width: "100%", alignItems: "center" }}>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleChange("email")}
                        value={values.email}
                        placeholder="Email or Username"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="gray"
                    />
                    <ErrorMessage name="email" component={Text} style={{ color: 'red' }} />

                    <TextInput
                        style={styles.input}
                        onChangeText={handleChange("password")}
                        value={values.password}
                        placeholder="Password"
                        secureTextEntry
                        placeholderTextColor="gray"
                    />
                    <ErrorMessage name="password" component={Text} style={{ color: 'red' }} />


                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={{
                            marginTop: 30,
                            width: "80%",
                            height: 40,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#2196F3",
                            borderRadius: 6,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 2,
                            elevation: 5,
                        }}
                    >
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                            Login
                        </Text>
                    </TouchableOpacity>

                </View>
            )}
        </Formik>


            <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>Or, login with</Text>
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
            <Text style={{marginTop: 40, color: '#888'}}>dont have an account?</Text>
            <Pressable
                    onPress={()=>router.push("./SignUp")}
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
                <Text style={{color: '#2196F3', fontWeight: 'bold',fontSize: 20}}>Sign up</Text>
            </Pressable>
        
        </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    pageHeader: {
        color: '#2196F3',
        fontSize: 30,
        fontWeight: 'bold',
        margin: 20,
        alignSelf: 'center',
    },
    safeAreaProviderContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
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
    checkBoxContainer: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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

export default Login;