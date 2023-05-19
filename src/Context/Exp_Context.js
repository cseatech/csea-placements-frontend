// import React from 'react';
// import createDataContext from './createDataContext';
// import todolistApi from '../api/todolist';
// // import { navigate } from '../NavigationRef';

// const expReducer = (state,action)=>{
//     switch(action.type){
//         case 'get_all_lists':
//             return {...state,lists:action.payload};

//         // case 'update_list':
//         //     return {errorMessage:'',lists:[...state.lists,action.payload]};   

//         case 'add_error':
//             return {...state,errorMessage:action.payload};

//         case 'clear_error':
//             return {...state,errorMessage:''};

//         default:
//             return state;
//     }
// };

// const clearErrorMessage =(dispatch)=>{
//     return ()=>{
//         dispatch({type:'clear_error'});
//     }
// };



// const updateList = (dispatch)=>{
//     return async({title,description,id})=>{
//         try{
//             await todolistApi.put(`/todo/${id}`,{title,description});
//             // dispatch({type:'update_list',payload:{title,description,id}});
//             navigate('TodoDetail',{id});
//         }
//         catch(err){
//             console.log(err.message);
//             dispatch({type:'add_error',payload:'Something Went Wrong!'});
//         }
//     }
// }

// const addList = (dispatch)=>{
//     return async({title,description})=>{
//         // console.log(title,description);
//         try{
//             await todolistApi.post('/todo',{title,description});
//             // await getAllLists();
//             navigate('Todolist');
//         }
//         catch(err){
//             console.log(err.message);
//             dispatch({type:'add_error',payload:"Something Went Wrong!"});
//         }
//     }
// };

// const getAllLists = (dispatch) =>{
//     return async()=>{
//         try{
//             const response = await todolistApi.get('/todo');
//             // console.log(lists);
//             dispatch({type:'get_all_lists',payload:response.data.data});
//         }
//         catch(err){
//             console.log(err);
//         }
//     }
// }

// export const {Context,Provider} = createDataContext(
//     expReducer,
//     {getAllLists,addList,updateList,clearErrorMessage,deleteList},
//     {lists:[],errorMessage:''}
// ); 