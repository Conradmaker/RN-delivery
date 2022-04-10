import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import DismissKeyboardView from '../components/DismissKeyboardView';
import Config from 'react-native-config';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const [loading, setLoading] = useState(false);

  const onSubmit = React.useCallback(async () => {
    if (!email || !email.trim()) {
      return Alert.alert('실패', '이메일을 확인해주세요');
    }
    if (!name || !name.trim()) {
      return Alert.alert('실패', '이메일을 확인해주세요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('실패', '비밀번호을 확인해주세요');
    }
    try {
      setLoading(true);
      await axios.post(`${Config.API_URL}/user`, {
        email,
        name,
        password,
      });
      return Alert.alert('성공', '성공');
    } catch (e) {
      const axiosError = (e as AxiosError).response;
      console.error(axiosError?.data.message);
      return Alert.alert('실패', '실패');
    } finally {
      setLoading(false);
    }
  }, [email, name, password]);

  const notValid = !email || !password || !name;
  return (
    <DismissKeyboardView>
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
              nameRef.current?.focus();
            }}
            ref={emailRef}
          />
        </View>
        <View>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력해주세요"
            placeholderTextColor={'#aaa'}
            onChangeText={t => setName(t)}
            value={name}
            secureTextEntry
            importantForAutofill="yes"
            onSubmitEditing={() => {
              passwordRef.current?.focus();
            }}
            textContentType="nickname"
            ref={nameRef}
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
            disabled={notValid || loading}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.lgBtnText}>회원가입</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {paddingHorizontal: 24, paddingBottom: 100},
  lgButtonCol: {},
  lgButton: {
    backgroundColor: '#aaa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 8,
    marginTop: 32,
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
