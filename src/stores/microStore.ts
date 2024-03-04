// @ts-nocheck
import {makeAutoObservable} from "mobx";
import MicroFilesService from "../services/MicroFilesService";

class MicroStore {

    records = [];
    files = new Map();
    waveforms = [];

    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setRecords(data) {
        this.records = data;
    }

    addRecord(data) {
        const newData = [...this.records, data];
        this.setRecords(newData);
    }

    setIsLoading(status: boolean) {
        this.isLoading = status;
    }

    getRecordFile(config) {
        const id = config.id;
        if (!this.files.has(id)) {
            this.setIsLoading(true);
            return MicroFilesService.downloadMicroFile(config)
                .then((response) => {
                    const url = URL.createObjectURL(new Blob([response.data], {type: "audio/mpeg"}));
                    this.files.set(id, url);
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    this.setIsLoading(false);
                });
        }
    }

    async downloadFile(config) {
        this.setIsLoading(true);
        return MicroFilesService.downloadMicroFile(config)
            .then((response) => {
                const url = URL.createObjectURL(new Blob([response.data], {type: "audio/mpeg"}));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${config.name}`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    getFileFromStore(id) {
        return this.files.get(id);
    }

    deleteFileFromStore(id) {
        this.files.delete(id);
    }

    deleteRecord(config) {
        const id = config.ids[0];
        // this.setIsLoading(true);
        return MicroFilesService.deleteMicroFile(config).then((res) => {
            this.setRecords(this.records.filter(record => record.id !== id));
            this.files.delete(id);
        }).catch((error) => console.error(error))
            .finally(() => {
                // this.setIsLoading(false);
            });
    }

    addWaveform(waveform) {
        this.waveforms.push(waveform);
    }

    resetWaveforms() {
        this.waveforms = [];
    }
}

export default new MicroStore();
