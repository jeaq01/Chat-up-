 import { gql, useMutation } from '@apollo/client';

 const REGISTER_USER = gql`
   mutation Register($username: String!, $password: String!) {
     register(username: $username, password: $password) {
       id
       username
     }
   }
 `;

 const LOGIN_USER = gql`/   mutation Login($username: String!, $password: String!) {
     login(username: $username, password: $password)
   }
 `;

 export const useRegister = () => {
   const [register] = useMutation(REGISTER_USER);
   return async (username, password) => {
     await register({ variables: { username, password } });
   };
 }
 export const useLogin = () => {
   const [login] = useMutation(LOGIN_USER);
   return async (username, password) => {
     const { data } = await login({ variables: { username, password } });
     localStorage.setItem('token', data.login);
   };
 };
