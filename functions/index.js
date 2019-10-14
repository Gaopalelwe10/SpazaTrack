const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();

exports.aggregateComments = functions.firestore
    .document('spazashop/{spazaId}/comments/{commentId}')
    .onWrite((change, context) => {

        const commentId = context.params.commentId;
        const spazaId = context.params.spazaId;
        console.log(spazaId + "===jjjj===" + commentId)
            // ref to the parent document
        const docRef = admin.firestore().collection('spazashop').doc(spazaId)

        // get all comments and aggregate
        return docRef.collection('comments').orderBy('createdAt', 'desc')
            .get()
            .then(querySnapshot => {

                // get the total comment count
                const commentCount = querySnapshot.size

                const recentComments = []

                // add data from the 5 most recent comments to the array
                querySnapshot.forEach(doc => {
                    recentComments.push(doc.data())
                });

                recentComments.splice(5)

                // record last comment timestamp
                const lastActivity = recentComments[0].createdAt

                // data to update on the document
                const data = { commentCount, recentComments, lastActivity }
                console.log(spazaId + "===jjjj===" + commentId)
                    // run update
                return docRef.update(data)
            })
            .catch(err => console.log(err))
    });