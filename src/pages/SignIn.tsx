import {NativeStackScreenProps} from '@react-navigation/native-stack';
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
import {RootStackParamList} from '../../App';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;
export default function SignIn({navigation}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const goSignup = React.useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const onSubmit = React.useCallback(() => {
    if (!email || !email.trim()) {
      return Alert.alert('실패', '이메일을 확인해주세요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('실패', '비밀번호을 확인해주세요');
    }
  }, [email, password]);

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
  lgButtonCol: {},
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
