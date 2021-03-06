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
    } else if (getSmoke() === null) {
        upload_status.style.display = 'initial';
        upload_status.innerText = 'حدد هل أنت مدخن أولا';
        upload_status.style.color = 'red';
        document.getElementById('record').style.backgroundColor = 'red';
    } else if (getCovid() === null) {
        upload_status.style.display = 'initial';
        upload_status.innerText = 'حدد حالتك الطبية أولا';
        upload_status.style.color = 'red';
        document.getElementById('record').style.backgroundColor = 'red';
    } else if (getMedical() === null) {
        upload_status.style.display = 'initial';
        upload_status.innerText = 'حدد أحد الأمراض أولاً';
        upload_status.style.color = 'red';
        document.getElementById('record').style.backgroundColor = 'red';
    }
    else if (getEffect() === null) {
        upload_status.style.display = 'initial';
        upload_status.innerText = 'حدد أحد الأعراض أولاً';
        upload_status.style.color = 'red';
        document.getElementById('record').style.backgroundColor = 'red';
    }
    else if (getRecordMethod() === null) {
        upload_status.style.display = 'initial';
        upload_status.innerText = 'حدد طريقة تسجيل السعال أولاً';
        upload_status.style.color = 'red';
        document.getElementById('record').style.backgroundColor = 'red';
    }
    else {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                const date = new Date();
                const audioContainer = document.getElementById('audio-container');
                document.getElementById('audio-element') != null ? document.getElementById('audio-element').remove() : '';

                mediaRecorder.start();
                document.getElementById('stop').className = 'btn btn-danger active';
                upload_status.style.display = 'none';

                let audioChunks = [];
                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                    // Rremove Previus Record If exist
                    document.getElementById('audio-element') != null ? document.getElementById('audio-element').remove() : '';

                    // Create New Element For Audio
                    var audio = document.createElement("audio");
                    audio.id = 'audio-element';
                    audio.controls = true;
                    audio.style.width = '100%';
                    audio.src = URL.createObjectURL(event.data)
                    audioContainer.appendChild(audio);
                });

                mediaRecorder.addEventListener("stop", () => {

                    // uploadData(audioBlob, date);
                });
                play.addEventListener("click", event => {
                    var audio = document.getElementById('audio-element');
                    audio.play();
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
                    document.getElementById('upload').style.display = 'initial';
                });
            });

    }
}

function writeData(date) {
    console.log('Gender ' + getGender());
    console.log('Age ' + getAge());
    console.log('Covid ' + getCovid());
    console.log('Smoke ' + getSmoke());
    console.log('Medical ' + getMedical());
    console.log('effect ' + getEffect());
    console.log('recordMethod ' + getRecordMethod());
    var gender = getGender();
    var age = getAge();
    var covid = getCovid();
    var smoke = getSmoke();
    var disease = getMedical();
    var effect = getEffect();
    var recordMethod = getRecordMethod();
    var timestamp = (typeof date === 'undefined') ? 'null' : date.toString();

    gender = (typeof gender === 'undefined') ? 'null' : gender;
    age = (typeof age === 'undefined') ? 'null' : age;
    covid = (typeof covid === 'undefined') ? 'null' : covid;
    smoke = (typeof smoke === 'undefined') ? 'null' : smoke;
    disease = (typeof disease === 'undefined') ? 'null' : disease;
    effect = (typeof effect === 'undefined') ? 'null' : effect;
    recordMethod = (typeof recordMethod === 'undefined') ? 'null' : recordMethod;

    var database = firebase.database();
    // var key = database.ref('users/').push().key;
    database.ref('users/' + date).set({
        timeStamp: timestamp,
        gender: gender,
        age: age,
        smoke: smoke,
        covid: covid,
        disease: disease,
        effect: effect,
        recordMethod: recordMethod
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
        return 'male';
    } else if (female) {
        return 'female';
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
    upload_status.style.display = 'none';
    document.getElementById('record').style.backgroundColor = ''
    document.getElementById('record').className = 'btn btn-default';
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
        return 'yes';
    } else if (no) {
        return 'no';
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

    var medicalsButtons = document.getElementsByName('medical');
    var val = document.getElementById('medical').value;

    let result = null;
    medicalsButtons.forEach(med => {
        if (med.checked) {
            if (med.value == 'other') {
                result = val.length > 2 ? val : null;
            } else {
                result = med.value;
            }
        }
    });
    return result;
}


function setMedical(status) {
    upload_status.style.display = 'none';
    document.getElementById('record').style.backgroundColor = ''
    document.getElementById('record').className = 'btn btn-default';

    if (status == 'other') {
        document.getElementById('medical').style.display = 'block';
    } else {
        document.getElementById('medical').style.display = 'none';
    }
}



function setEffect() {
    upload_status.style.display = 'none';
    document.getElementById('record').style.backgroundColor = ''
    document.getElementById('record').className = 'btn btn-default';
}

function getEffect() {

    var effectButtons = document.getElementsByName('effect');

    let result = null;
    effectButtons.forEach(eff => {
        if (eff.checked) {
            result = eff.value;
        }
    });
    return result;
}

function setRecordMethod() {
    upload_status.style.display = 'none';
    document.getElementById('record').style.backgroundColor = ''
    document.getElementById('record').className = 'btn btn-default';
}


function getRecordMethod() {

    var recordMethodButtons = document.getElementsByName('record-method');

    let result = null;
    recordMethodButtons.forEach(eff => {
        if (eff.checked) {
            result = eff.value;
        }
    });
    return result;
}


function setSmoke() {
    upload_status.style.display = 'none';
    document.getElementById('record').style.backgroundColor = ''
    document.getElementById('record').className = 'btn btn-default';
}

function getSmoke() {

    var smokeButtons = document.getElementsByName('smoke');

    let result = null;
    smokeButtons.forEach(eff => {
        if (eff.checked) {
            result = eff.value;
        }
    });
    return result;
}
