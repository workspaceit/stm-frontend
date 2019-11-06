import { toast } from "react-toastify";

export const SUCCESS = 'SUCCESS';
export const DELETE = 'DELETE';
export const NOTICE = 'NOTICE';

export function successAction(message) {
  return function(dispatch) {
    dispatch({
      type: SUCCESS
    });
    toast.info(message);
  };
}

export function deleteAction(message) {
  return function(dispatch) {
    dispatch({
      type: DELETE
    });
    toast.error(message);
  };
}

export function noticeAction(message) {
  return function(dispatch) {
    dispatch({
      type: NOTICE
    });
    toast.info(message);
  };
}