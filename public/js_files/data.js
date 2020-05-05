document.getElementById('excel').addEventListener("click", async () => {
    // let data = {
    //     credentials: "Em@nate_UCSD-Hp_Game"
    // }
    // very rudamentary form check but quick and gets job done

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
        a.setAttribute('download', 'Subjects.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };



    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const res = await fetch('/api/subject', options)
    const json = await res.json();
    // console.log(json)

    const data = json.Subjects.map(row => ({
        email: row.email,
        firstName: row.firstName,
        wantsConsentEmailed: row.wantsConsentEmailed
    }))


    const csvData = objectToCsv(json.Subjects);

    download(csvData);

})