import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios, {AxiosError} from 'axios';
import React from 'react';
import {useRef} from 'react';
import {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import {RootStackParamList} from '../../App';
import {useAppDispatch} from '../modules';
import userSlice from '../modules/user';
import EncryptedStorage from 'react-native-encrypted-storage';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;
export default function SignIn({navigation}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const goSignup = React.useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const onSubmit = React.useCallback(async () => {
    if (!email || !email.trim()) {
      return Alert.alert('실패', '이메일을 확인해주세요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('실패', '비밀번호을 확인해주세요');
    }
    try {
      setLoading(true);
      const {data} = await axios.post(`${Config.API_URL}/login`, {
        email,
        password,
      });
      Alert.alert('성공', '성공');
      dispatch(
        userSlice.actions.setUser({
          email: data.data.email,
          name: data.data.name,
          accessToken: data.data.accessToken,
        }),
      );
      await EncryptedStorage.setItem('refreshToken', data.data.refreshToken);
      console.log(data);
    } catch (e) {
      const axiosError = (e as AxiosError).response;
      console.error(axiosError?.data.message);
      return Alert.alert('실패', axiosError?.data.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, dispatch]);

  const notValid = !email || !password;
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일을 입력해수세요"
          placeholderTextColor={'#aaa'}
          onChangeText={t => setEmail(t)}
          value={email}
          importantForAutofill="yes"
          textContentType="emailAddress"
          returnKeyType="next"
          blurOnSubmit={false}
          keyboardType="email-address"
          onSubmitEditing={() => {
            passwordRef.current?.focus();
          }}
          ref={emailRef}
        />
      </View>
      <View>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력해주세요"
          placeholderTextColor={'#aaa'}
          onChangeText={t => setPassword(t)}
          value={password}
          secureTextEntry
          importantForAutofill="yes"
          textContentType="password"
          ref={passwordRef}
        />
      </View>
      <View style={styles.lgButtonCol}>
        <TouchableOpacity
          style={[styles.lgButton, !notValid ? styles.lgButtonActive : null]}
          onPress={onSubmit}
          disabled={notValid}>
          <Text style={styles.lgBtnText}>로그인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.lgButtonCol}>
        <TouchableOpacity style={styles.suButton} onPress={goSignup}>
          <Text style={styles.lgBtnText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {paddingHorizontal: 24},
  lgButtonCol: {marginTop: 32},
  lgButton: {
    backgroundColor: '#aaa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  suButton: {
    backgroundColor: '#aaa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  lgButtonActive: {
    backgroundColor: 'blue',
  },
  lgBtnText: {color: '#fff', textAlign: 'center'},
  input: {color: '#000', padding: 4, borderBottomWidth: 0.2, fontSize: 16},
  label: {
    color: '#000aaa',
    marginBottom: 4,
    marginTop: 32,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
