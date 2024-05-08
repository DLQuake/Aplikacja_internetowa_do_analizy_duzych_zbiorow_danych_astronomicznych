import React, { useState } from 'react';
import moment from 'moment';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';

const PDFGenerator = ({ temperatureChartRef, humidityChartRef, precipitationChartRef, windSpeedChartRef, windDirectionChartRef, selectedLocation }) => {
    const [downloadingPDF, setDownloadingPDF] = useState(false);

    const downloadPDFReport = async () => {
        setDownloadingPDF(true);

        try {
            const chartImages = await Promise.all([
                getImageFromChart(temperatureChartRef.current),
                getImageFromChart(humidityChartRef.current),
                getImageFromChart(precipitationChartRef.current),
                getImageFromChart(windSpeedChartRef.current),
                getImageFromChart(windDirectionChartRef.current)
            ]);

            const pdf = new jsPDF();
            const fileName = `Forecast_Weather_Report_${selectedLocation}_${moment().format("YYYYMMDD_HHmmss")}.pdf`;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.setFontSize(40);
            pdf.setTextColor(65, 105, 225);
            pdf.text("Forecast Weather Report", pageWidth / 2, pageHeight / 2, { align: 'center' });
            pdf.setTextColor(0);
            pdf.text("Weather forecast for city", pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
            pdf.text(`"${selectedLocation}"`, pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });

            addChartToPDF(pdf, chartImages[0], "Temperature Chart", 20, 120, pageWidth - 40, 150, pageWidth);
            addChartToPDF(pdf, chartImages[1], "Humidity Chart", 20, 120, pageWidth - 40, 150, pageWidth);
            addChartToPDF(pdf, chartImages[2], "Precipitation Chart", 20, 120, pageWidth - 40, 150, pageWidth);
            addChartToPDF(pdf, chartImages[3], "Wind Speed Chart", 20, 120, pageWidth - 40, 150, pageWidth);
            addChartToPDF(pdf, chartImages[4], "Wind Direction Chart", 20, 120, pageWidth - 40, 150, pageWidth);

            const weatherDataTable = document.getElementById("weatherDataTable");
            addTableToPDF(pdf, weatherDataTable, "Weather Data Table", pageWidth);

            pdf.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setDownloadingPDF(false);
        }
    };

    const getImageFromChart = (chartRef) => {
        return htmlToImage.toPng(chartRef.canvas)
            .then((dataUrl) => {
                return dataUrl;
            })
            .catch((error) => {
                console.error('Error generating image from chart:', error);
                return null;
            });
    };

    const addChartToPDF = (pdf, imageData, title, x, y, width, height, pageWidth) => {
        pdf.addPage();
        pdf.setFontSize(20);
        pdf.setTextColor(65, 105, 225);
        pdf.text(title, pageWidth / 2, 50, { align: 'center' });
        pdf.setTextColor(0);
        if (imageData) {
            pdf.addImage(imageData, 'PNG', x, y, width, height);
        } else {
            pdf.text("Problem with chart", 10, 20);
        }
    };

    const addTableToPDF = (pdf, table, title, pageWidth) => {
        pdf.addPage();
        pdf.setFontSize(20);
        pdf.setTextColor(65, 105, 225);
        pdf.text(title, pageWidth / 2, 10, { align: 'center' });
        pdf.setTextColor(0);
        if (table) {
            pdf.autoTable({ html: table });
        } else {
            pdf.text("Problem with table", 10, 20);
        }
    };

    return (
        <div>
            <div className="control has-text-centered m-6">
                <button
                    className={`button is-link ${downloadingPDF ? 'is-loading' : ''}`}
                    onClick={downloadPDFReport}
                    disabled={downloadingPDF}
                >
                    {downloadingPDF ? 'Generating PDF...' : 'Download report'}
                </button>
            </div>
        </div>
    );
};

export default PDFGenerator;
