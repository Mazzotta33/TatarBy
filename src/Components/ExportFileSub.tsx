import { useNavigate } from "react-router-dom";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

// 🔽 твои субтитры
const subtitles = [
    { start: 27.2, end: 33.42, lang: "ru", text: { ru: "Мы рады приветствовать гостей и участников восьмого Международного Золотардынского форума.", tt: "Сигезенче Халыкара Алтын Урда форумында катнашучыларны һәм кунакларны каршы алуыбызга шатбыз.", ar: "" } },
    { start: 33.42, end: 43.0, lang: "ru", text: { ru: "Они вносят существенный вклад в изучение истории как татарского народа, так и народов Республики Татарстан и в целом истории России.", tt: "Алар татар халкының, Татарстан Республикасы халыкларының һәм гомумән, Россия тарихының тарихын өйрәнүгә зур өлеш кертә.", ar: "" } },
    { start: 46.7, end: 57.5, lang: "ru", text: { ru: "Лусджучи или Золотая Орда является неотлеваемой частью российского культурного пространства и является частью общероссийского прошлого.", tt: "Лусджучи, ягъни Алтын Урда, Россия мәдәниятенең аерылгысыз өлеше булып тора һәм гомумроссия үткәненең өлеше булып тора.", ar: "" } },
    { start: 59.7, end: 64.18, lang: "ar", text: { ar: "في الواقع أنا مسرور جداً للمشاركة في هذا المؤتمر الدولي", ru: "", tt: "" } },
    { start: 64.18, end: 73.0, lang: "ar", text: { ar: "ولقد حسني الشرف بأن أكون من الشخصيات التي شدت الرحال من أقصى الغرب الإسلامي إلى أسير وسطة وبالضبط إلى قزان", ru: "", tt: "" } },
    { start: 74.0, end: 87.3, lang: "ru", text: { ru: "Для меня, во-первых, произвело серьезное впечатление количество участников, среди них достаточно большой состав известных людей, историков. Когда у человека есть сильные корни, он всегда в этой жизни будет уверенно стоять на своих ногах.", tt: "Минем өчен, беренчедән, катнашучыларның саны, шул исәптән билгеле кешеләр, тарихчылар саны да шактый зур иде, чөнки кешенең тамырлары нык булгач, ул бу тормышта һәрвакыт үз аякларында ышаныч белән торачак.", ar: "" } },
    { start: 95.0, end: 98.4, lang: "ru", text: { ru: "В истории не бывает однозначно хорошего или плохого явления.", tt: "Тарихта бернинди дә яхшы яки начар күренешләр юк.", ar: "" } },
    { start: 99.4, end: 105.0, lang: "ru", text: { ru: "Мы из любого явления должны извлекать уроки для того, чтобы идти дальше.", tt: "Алга таба барыр өчен, без һәркайсы күренештән сабак алырга тиеш.", ar: "" } },
    { start: 114.0, end: 129.2, lang: "ru", text: { ru: "Золото-Арденский форум – это мероприятие, которое имеет уже в международном масштабе хороший отклик, хорошо известное и, наверное, одно из главных научных мероприятий по тематике истории средних веков евразийского пространства.", tt: "Алтын-Ардэн форумы - халыкара дәрәҗәдә яхшы кабул ителгән, яхшы билгеле һәм, бәлки, Евразия киңлегенең урта гасырлар тарихы темасына багышланган төп фәнни чараларның берсе.", ar: "" } },
    { start: 133.6, end: 139.04, lang: "ru", text: { ru: "Золотая Орда и Лос-Джучи – это те основы, на которых", tt: "Алтын Урда һәм Лос-Джучи - бу нигезләр.", ar: "" } },
    { start: 139.04, end: 141.4, lang: "ru", text: { ru: "построена государственность многих наших стран.", tt: "Күп кенә илләребезнең дәүләтчелеге төзелгән.", ar: "" } },
    { start: 162.5, end: 167.84, lang: "ru", text: { ru: "Международный Золотардынский форум – это уже такой бренд для всех специалистов,", tt: "Халыкара Алтын Урда форумы инде барлык белгечләр өчен шундый бренд.", ar: "" } },
    { start: 168.04, end: 171.66, lang: "ru", text: { ru: "кто занимается золотардынским периодом, периодом татарских ханцев,", tt: "Алтын чоры, татар ханнары чоры,", ar: "" } },
    { start: 171.78, end: 174.5, lang: "ru", text: { ru: "для тех, кто занимается средними веками.", tt: "урта гасырлар белән шөгыльләнүчеләр өчен.", ar: "" } },
    { start: 176.4, end: 184.0, lang: "ru", text: { ru: "И мы, конечно, как организаторы, всегда готовы принять наших уважаемых коллег в Казани, в Булгарии, в Татарстане.", tt: "Һәм без, әлбәттә, оештыручылар буларак, Казанда, Болгариядә, Татарстанда хөрмәтле хезмәттәшләребезне кабул итәргә һәрвакыт әзер.", ar: "" } },
];

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);

const ExportFileSub = () => {
    const navigate = useNavigate();

    const handleExportVideo = () => {
        const videoUrl = localStorage.getItem("uploadedVideo");
        if (!videoUrl) {
            alert("Видео не найдено в localStorage");
            return;
        }
        const link = document.createElement("a");
        link.href = videoUrl;
        link.download = "video.mp4";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadSubtitles = async () => {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: subtitles.map((sub, index) => {
                        const timeRange = `[${sub.start.toFixed(2)} - ${sub.end.toFixed(2)}]`;

                        const lines = [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: `${index + 1}. ${timeRange}`, bold: true }),
                                ],
                            }),
                        ];

                        Object.entries(sub.text).forEach(([lang, value]) => {
                            if (value) {
                                lines.push(
                                    new Paragraph({
                                        children: [new TextRun({ text: `${lang}: ${value}` })],
                                    })
                                );
                            }
                        });

                        return lines;
                    }).flat(),
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, "subtitles.docx");
    };

    return (
        <div className="h-full flex flex-col items-center bg-gray-50">
            <div className="w-full max-w-6xl mb-8">
                <div className="w-full max-w-6xl px-6 py-4">
                    <button onClick={() => navigate("/edit")} className="text-blue-600">← Назад</button>
                </div>

                <div className="flex flex-row justify-center gap-10">
                    <div className="flex justify-center items-center gap-4 mt-30 mb-20">
                        <button
                            onClick={handleExportVideo}
                            className="flex items-center px-10 py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:brightness-110 transition"
                        >
                            <DownloadIcon/>
                            Скачать переведенное видео
                        </button>
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-30 mb-20">
                        <button
                            onClick={handleDownloadSubtitles}
                            className="flex items-center px-10 py-5 rounded-2xl bg-white text-green-500 font-bold text-lg shadow-lg hover:shadow-2xl hover:bg-gray-100 transition"
                        >
                            <DownloadIcon/>
                            Скачать субтитры в .docx
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="w-full max-w-4xl p-12 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 text-lg">
                Место для вашей рекламы
            </div>
        </div>
    );
};

export default ExportFileSub;
