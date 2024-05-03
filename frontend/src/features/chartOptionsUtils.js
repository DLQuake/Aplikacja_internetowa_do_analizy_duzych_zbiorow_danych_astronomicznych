export const chartOptions = (xTitle, yTitle) => ({
    plugins: {
        tooltip: {
            intersect: false,
            mode: 'index',
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: xTitle,
            },
        },
        y: {
            title: {
                display: true,
                text: yTitle,
            },
        },
    },
});
