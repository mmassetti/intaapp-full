//@ts-check
import firestore from '@react-native-firebase/firestore';
import {SpinnerService} from './spinnerService';

export class FirebaseUtils {
  withSpinner = SpinnerService.getInstance().callAsyncFunctionWithSpinner;

  getAll = collectionName => {
    const collection = firestore().collection(collectionName);
    return this.withSpinner(collection.get.bind(collection));
  };

  getDocRefFromId = (collectionName, id) => {
    return firestore()
      .collection(collectionName)
      .doc(id);
  };
  getDocRefInnerId = async (collectionName, innerId) => {
    const {
      docs: [doc],
    } = await firestore()
      .collection(collectionName)
      .where('id', '==', innerId)
      .get();
    return {
      docRef: doc.ref,
      data: doc.data(),
    };
  };

  addObjToCollection = (collectionName, objToAdd) => {
    return firestore()
      .collection(collectionName)
      .add(objToAdd);
  };

  addObjToArray = (docRef, attribute, objToAdd) => {
    return docRef.update({
      [attribute]: firestore.FieldValue.arrayUnion(objToAdd),
    });
  };

  removeItemFromArray = async (docRef, attribute, idToRemove) => {
    const response = await docRef.get();
    const oldArray = response.data()[attribute];
    const newArray = oldArray.filter(item => item.id !== idToRemove);
    return docRef.update({
      [attribute]: newArray,
    });
  };

  uploadPhoto = async ({docRef, beforeId}, imageToAdd) => {
    let newImages;
    if (!beforeId) {
      newImages = firestore.FieldValue.arrayUnion({before: imageToAdd});
    } else {
      const data = (await docRef.get()).data();
      newImages = data.images.map(image => {
        return image.before.id == beforeId
          ? {...image, after: imageToAdd}
          : image;
      });
    }
    return this.withSpinner(docRef.update.bind(docRef, {images: newImages}));
  };
}
