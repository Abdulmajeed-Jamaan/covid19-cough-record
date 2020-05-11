const firebaseConfig = {
    apiKey: "AIzaSyBxzSGhxQ3x8cQDqJz_yukdreuTRImHvGo",
    authDomain: "cough4science.firebaseapp.com",
    databaseURL: "https://cough4science.firebaseio.com",
    projectId: "cough4science",
    storageBucket: "cough4science.appspot.com",
    messagingSenderId: "692709603905",
    appId: "1:692709603905:web:5b9b8d752e52fb652a64c0",
    measurementId: "G-EMKPCG1BER"
};
firebase.initializeApp(firebaseConfig);


// var ref = database.ref('Users/');

// ref.on("value", function (snapshot) {
//     document.getElementById('table-order').innerHTML = "";
//     snapshot.forEach(function (childSnapshot) {
//         fetchData(childSnapshot);
//     });
//     document.getElementById('total-users').innerHTML = snapshot.numChildren();
// });
// database.ref('users/').set({
//     username: 'name',
//     email: 'email',
//     profile_picture : 'pic'
// });


var stop = document.getElementById('stop');
var play = document.getElementById('play-again');
var upload = document.getElementById('upload-yes');
var upload_status = document.getElementById('upload-status');
var submit_status = document.getElementById('submit-status');
var med_disease = document.getElementById('medical');
var genderr;

med_disease.addEventListener("input", event => {
    upload_status.style.display = 'none';
    document.getElementById('record').style.backgroundColor = ''
    document.getElementById('record').className = 'btn btn-default';
});

function recordAudio() {

    if (getGender() === null) {
        console.log(getAge());
        upload_status.style.display = 'initial';
        upload_status.innerText = 'حدد جنسك أولاً';
        upload_status.style.color = 'red';
        document.getElementById('record').style.backgroundColor = 'red';
    } else if (getAge() === null) {
        upload_status.style.display = 'initial';
        upload_status.innerText = 'حدد عمرك أولا';
        upload_status.style.color = 'red';
        document.getElementById('record').style.backgroundColor = 'red';
    } else if (getCovid() === null) {
        upload_status.style.display = 'initial';
        upload_status.innerText = 'حدد حالتك الطبية أولا';
        upload_status.style.color = 'red';
        document.getElementById('record').style.backgroundColor = 'red';
    } else if (getMedical() === 'none') {
        console.log(getMedical());
        upload_status.style.display = 'initial';
        upload_status.innerText = 'حدد حالة مرضك أولاً';
        upload_status.style.color = 'red';
        document.getElementById('record').style.backgroundColor = 'red';
    }
    else {
        // document.getElementById('record').style.backgroundColor = '#87654d';
        console.log(getMedical());
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                const date = new Date();
                const audioContainer = document.getElementById('audio-container');

                mediaRecorder.start();
                document.getElementById('stop').className = 'btn btn-danger active';
                upload_status.style.display = 'none';

                let audioChunks = null;
                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks = event.data;

                    if (document.getElementById('audio-element') != null) {
                        var audio = document.getElementById('audio-element');
                        audio.src = URL.createObjectURL(event.data)
                        audio.play();
                    } else {
                        var audio = document.createElement("audio");
                        audio.id = 'audio-element';
                        audio.controls = true;
                        audio.src = URL.createObjectURL(event.data)
                        audioContainer.appendChild(audio);
                    }
                });

                mediaRecorder.addEventListener("stop", () => {
                    // const audioUrl = URL.createObjectURL(audioChunks);
                    // audioEl.style.display = 'block';
                    // audioEl.src = audioUrl;
                    // audioEl.play();
                    // uploadData(audioBlob, date);
                });
                play.addEventListener("click", event => {
                    audioEl.style.display = 'block';
                    audioEl.play();
                    // uploadData(audioBlob, date);
                });
                upload.addEventListener("click", event => {
                    var audioBlob = new Blob(audioChunks);
                    writeData(date);
                    uploadData(audioBlob, date);
                });
                stop.addEventListener("click", event => {
                    if (mediaRecorder.state !== 'inactive') {
                        mediaRecorder.stop();
                        mediaRecorder.stream.getTracks()[0].stop()
                    }
                    document.getElementById('stop').className = 'btn btn-default';
                    document.getElementById('upload').style.display = 'initial'
                });
            });

    }
}

function writeData(date) {
    console.log('Gender ' + getGender());
    console.log('Age ' + getAge());
    console.log('Covid ' + getCovid());
    console.log('Medical ' + getMedical());
    var gender = getGender();
    var age = getAge();
    var covid = getCovid();
    var disease = getMedical();
    gender = (typeof gender === 'undefined') ? 'null' : gender;
    age = (typeof age === 'undefined') ? 'null' : age;
    covid = (typeof covid === 'undefined') ? 'null' : covid;
    disease = (typeof disease === 'undefined') ? 'null' : disease;
    var database = firebase.database();
    // var key = database.ref('users/').push().key;
    database.ref('users/' + date).set({
        gender: gender,
        age: age,
        covid: covid,
        disease: disease
    });
}

function uploadData(blob, date) {
    // File or Blob named mountains.jpg
    upload_status.style.display = 'initial'
    // Create the file metadata
    var metadata = {
        contentType: 'audio/wav'
    };
    var storageRef = firebase.storage().ref('recordings/' + date + '.wav')
    // storageRef.put(blob).then(function (snapshot) {
    //     console.log('Uploaded a blob or file!');
    // });


    // recording.put(audioBlob).then(function(snapshot) {
    //     console.log('Uploaded a blob or file!');
    //   });
    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.put(blob, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            upload_status.innerText = 'Upload is ' + progress + '% done';
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: { // or 'paused'
                    console.log('Upload is paused');
                    upload_status.innerText = 'Upload is paused!!!';
                    break;
                }
                case firebase.storage.TaskState.RUNNING: { // or 'running'
                    console.log('Upload is running');
                    upload_status.innerText = 'جارٍ التحميل ...';
                    break;
                }
            }
        }, function (error) {

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                case 'storage/canceled':
                    // User canceled the upload
                    break;

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        }, function () {
            // Upload completed successfully, now we can get the download URL
            // uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            //     console.log('File available at', downloadURL);

            // });
            upload_status.style.color = 'green'
            upload_status.innerText = 'تحميل ناجح. شكرا لك';
        });

}

function getGender() {
    var male = document.getElementById('male').checked;
    var female = document.getElementById('female').checked;
    if (male) {
        return 'Male';
    } else if (female) {
        return 'Female';
    } else {
        return null;
    }
}

function setGender(gender) {
    var male = document.getElementById('male');
    var female = document.getElementById('female');
    upload_status.style.display = 'none';
    document.getElementById('record').style.backgroundColor = ''
    document.getElementById('record').className = 'btn btn-default';
    if (gender === 'male') {
        male.checked = true;
        female.checked = false;
    } else if (gender === 'female') {
        male.checked = false;
        female.checked = true;
    }
}

function getAge() {
    var from18_25 = document.getElementById('18-25').checked;
    var from26_40 = document.getElementById('26-40').checked;
    var from41_50 = document.getElementById('41-50').checked;
    var from51_65 = document.getElementById('51-65').checked;
    var over65 = document.getElementById('over-65').checked;
    if (from18_25) {
        return '18 - 25';
    } else if (from26_40) {
        return '26 - 40';
    } else if (from41_50) {
        return '41 - 50';
    } else if (from51_65) {
        return '51-65';
    } else if (over65) {
        return 'Over 65';
    } else {
        return null;
    }
}

function exitUpload() {
    document.getElementById('upload').style.display = 'none';
    document.getElementById('stop').className = 'btn btn-default';
}

function setAge(ageGroup) {
    var from18_25 = document.getElementById('18-25');
    var from26_40 = document.getElementById('26-40');
    var from41_50 = document.getElementById('41-50');
    var from51_65 = document.getElementById('51-65');
    var over65 = document.getElementById('over-65');
    upload_status.style.display = 'none';
    document.getElementById('record').style.backgroundColor = ''
    document.getElementById('record').className = 'btn btn-default';
    if (ageGroup === '18-25') {
        from18_25.checked = true;
        from26_40.checked = false;
        from41_50.checked = false;
        from51_65.checked = false;
        over65.checked = false;
    } else if (ageGroup === '26-40') {
        from18_25.checked = false;
        from26_40.checked = true;
        from41_50.checked = false;
        from51_65.checked = false;
        over65.checked = false;
    } else if (ageGroup === '41-50') {
        from18_25.checked = false;
        from26_40.checked = false;
        from41_50.checked = true;
        from51_65.checked = false;
        over65.checked = false;
    } else if (ageGroup === '50-65') {
        from18_25.checked = false;
        from26_40.checked = false;
        from41_50.checked = false;
        from51_65.checked = true;
        over65.checked = false;
    } else if (ageGroup === 'over-65') {
        from18_25.checked = false;
        from26_40.checked = false;
        from41_50.checked = false;
        from51_65.checked = false;
        over65.checked = true;
    }
}




function getCovid() {
    var yes = document.getElementById('covid-yes').checked;
    var no = document.getElementById('covid-no').checked;
    if (yes) {
        return 'Yes';
    } else if (no) {
        return 'No';
    } else {
        return null;
    }
}


function setCovid(status) {
    var yes = document.getElementById('covid-yes');
    var no = document.getElementById('covid-no');
    upload_status.style.display = 'none';
    document.getElementById('record').style.backgroundColor = ''
    document.getElementById('record').className = 'btn btn-default';
    if (status === 'yes') {
        yes.checked = true;
        no.checked = false;
    } else if (status === 'no') {
        yes.checked = false;
        no.checked = true;
    }
}

function getMedical() {
    var yes = document.getElementById('med-yes').checked;
    var no = document.getElementById('med-no').checked;
    var maybe = document.getElementById('med-maybe').checked;
    if (yes) {
        var val = document.getElementById('medical').value;
        if (val) {
            upload_status.style.display = 'none';
            document.getElementById('record').style.backgroundColor = ''
            document.getElementById('record').className = 'btn btn-default';
            return val;
        } else {
            return 'none';
        }
    } else if (no) {
        return 'No';
    } else if (maybe) {
        return 'Maybe';
    } else {
        return 'none';
    }
}


function setMedical(status) {
    var yes = document.getElementById('med-yes');
    var no = document.getElementById('med-no');
    var maybe = document.getElementById('med-maybe');
    upload_status.style.display = 'none';
    document.getElementById('record').style.backgroundColor = ''
    document.getElementById('record').className = 'btn btn-default';
    if (status === 'yes') {
        yes.checked = true;
        no.checked = false;
        maybe.checked = false;
        document.getElementById('medical').style.display = 'initial';
    } else if (status === 'no') {
        yes.checked = false;
        no.checked = true;
        maybe.checked = false;
        document.getElementById('medical').style.display = 'none';
    } else if (status === 'maybe') {
        yes.checked = false;
        no.checked = false;
        maybe.checked = true;
        document.getElementById('medical').style.display = 'none';
    }
}