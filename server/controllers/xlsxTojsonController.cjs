const XLSX = require('xlsx');

exports.convertXLSXToJson = (req, res) => {
    if (!req.file) {
        return res.status(400).send("Aucun fichier n'a été téléchargé.");
    }

    try {
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheet_name_list = workbook.SheetNames;

        // Vérifier si le fichier XLSX est vide
        if (sheet_name_list.length === 0) {
            console.log(`Le fichier est vide.`);
            return res.status(400).send("Le fichier est vide.");
        }

        const jsonDataArray = [];

        sheet_name_list.forEach(function (y) {
            const worksheet = workbook.Sheets[y];
            const headers = {};
            const data = [];
            for (let z in worksheet) {
                if (z[0] === "!") continue;
                const col = z.substring(0, 1);
                const row = parseInt(z.substring(1));
                const value = worksheet[z].v;
                if (row === 1) {
                    headers[col] = value;
                    continue;
                }
                if (!data[row]) data[row] = {};
                data[row][headers[col]] = value;
            }
            data.shift();
            data.shift();
            res.json(data);
            console.log(data);

        });

    } catch (error) {
        console.error('Erreur lors de la lecture du fichier XLSX :', error);
        res.status(500).send("Erreur lors de la lecture du fichier XLSX.");
    }
};
