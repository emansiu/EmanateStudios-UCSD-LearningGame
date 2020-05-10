
// validate password to get into stats
try {

    document.getElementById('enter').addEventListener("click", async () => {
        console.log("clicked me");
        let enteredPW = document.getElementById('pw').value
        console.log(enteredPW);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credentials: enteredPW })
        }
        const res = await fetch('/auth', options)
        const jsonResponse = await res.json();
        if (res.status == 200) {
            localStorage.setItem("token", enteredPW);
            window.location.href = "/pages/stats.html";
        } else {
            alert("incorrect password");
        }
        console.log(jsonResponse);
        // ('/pages/stats.html')
        // const json = await res.json();
    })
}
catch (err) {
    console.error(err);
}

class DataToHandle {
    constructor(elementToClick, route, downloadName) {
        document.getElementById(elementToClick).addEventListener("click", async () => {
            //========== ORGANIZE FOR CSV==========
            const objectToCsv = (data) => {

                const csvRows = [];

                const headers = Object.keys(data[0]);
                csvRows.push(headers.join(','));

                for (const row of data) {
                    const values = headers.map(header => {
                        const escaped = ('' + row[header]).replace(/"/g, '\\"');
                        return `"${escaped}"`
                    })
                    csvRows.push(values.join(','));
                }

                return csvRows.join('\n');
            }
            // ====DOWNLOAD FUNCTION =======
            const download = (data) => {
                const blob = new Blob([data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', `${downloadName}.csv`);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };



            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ credentials: localStorage.getItem("token") })
            }
            const res = await fetch(route, options)
            const json = await res.json();

            const csvData = objectToCsv(json.ServerData);

            download(csvData);

        })
    }
}

// create instances of button handlers for specific data
const SubjectDownload = new DataToHandle('subjects', '/data/subject', "Subjects");
const TrialDownload = new DataToHandle('trials', '/data/trial', "Trials");
const DemographicsDownload = new DataToHandle('demographics', '/data/demographics', "Demographics");
const ExitInterviewDownload = new DataToHandle('exitInterview', '/data/exit', "ExitInterviews");
const QuizDownload = new DataToHandle('quiz', '/data/quiz', "Quizes");