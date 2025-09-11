import {useNavigate} from "react-router-dom";
import {useState} from "react";
import VideoPlayer from "./VideoPlayer.tsx";
import {Listbox} from "@headlessui/react";

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

const VideoWithSubtitles = () => {
    const navigate = useNavigate();

    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    const [audioVolume, setAudioVolume] = useState(1);
    const [tatarianVolume, setTatarianVolume] = useState(1);

    const speakers = ["Алмаз", "Алсу"];
    const [speaker, setSpeaker] = useState(speakers[0]);

    const languages = ["Русский", "Татарский", "Английский"];
    const [sourceLang, setSourceLang] = useState(languages[0]);
    const [targetLang, setTargetLang] = useState(languages[1]);

    const [subs, setSubs] = useState(subtitles);
    const [currentSub, setCurrentSub] = useState<null | { start: number; end: number; text: Record<string,string>; lang?: string }>(null);

    const handleTrimAndGoExport = () => {
        localStorage.setItem(
            "trimRange",
            JSON.stringify({
                start: trimStart,
                end: trimEnd,
                audioVolume,
                tatarianVolume,
                speaker,
                sourceLanguage: sourceLang,
                targetLanguage: targetLang,
            })
        );
        navigate("/export");
    };

    const langLabelToCode = (label: string) => {
        if (!label) return "ru";
        if (label.toLowerCase().startsWith("рус")) return "ru";
        if (label.toLowerCase().startsWith("тат")) return "tt";
        if (label.toLowerCase().startsWith("анг")) return "en";
        return "ru";
    };

    const targetCode = langLabelToCode(targetLang);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50">
            <div className="w-full max-w-6xl px-6 py-4">
                <button onClick={() => navigate("/")} className="text-blue-600">← Назад</button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl px-6">
                <div className="flex-1 flex flex-col items-center">
                    <VideoPlayer
                        trimStart={trimStart}
                        trimEnd={trimEnd}
                        onTrimChange={(s, e) => { setTrimStart(s); setTrimEnd(e); }}
                        onTimeUpdate={(time) => {
                            const found = subtitles.find(s => time >= s.start && time <= s.end);
                            if (found) {
                                setCurrentSub(found);
                            } else {
                                setCurrentSub(null);
                            }
                        }}
                    />

                    <div className="w-4/4 mt-4 h-50">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/70 text-white px-4 py-3 rounded-lg text-sm shadow min-h-[56px]">
                                <div className="text-xs text-gray-300 mb-1">{sourceLang}</div>
                                <div>
                                    {currentSub
                                        ? (currentSub.text[langLabelToCode(sourceLang)] ||
                                            currentSub.text.ru ||
                                            currentSub.text.tt ||
                                            currentSub.text.ar ||
                                            "—")
                                        : "—"}
                                </div>
                            </div>

                            <div className="bg-black/70 text-green-200 px-4 py-3 rounded-lg text-sm shadow min-h-[56px]">
                                <div className="text-xs text-gray-300 mb-1">{targetLang}</div>
                                {currentSub ? (
                                    <textarea
                                        className="w-full h-40 bg-transparent resize-none focus:outline-none text-green-200"
                                        rows={2}
                                        value={currentSub.text[targetCode] || ""}
                                        onChange={(e) => {
                                            const newText = e.target.value;
                                            setSubs(prev =>
                                                prev.map(s =>
                                                    s.start === currentSub.start && s.end === currentSub.end
                                                        ? { ...s, text: { ...s.text, [targetCode]: newText } }
                                                        : s
                                                )
                                            );
                                            setCurrentSub(cs =>
                                                cs ? { ...cs, text: { ...cs.text, [targetCode]: newText } } : cs
                                            );
                                        }}
                                    />
                                ) : (
                                    <div>—</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full md:w-72">
                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow hover:shadow-lg hover:brightness-105"
                        onClick={handleTrimAndGoExport}
                    >
                        Обрезать
                    </button>
                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:shadow-lg hover:brightness-105"
                        onClick={handleTrimAndGoExport}
                    >
                        Субтитры
                    </button>

                    <div className="border-t border-gray-200 my-2"/>
                </div>
            </div>
        </div>
    );
}


export default VideoWithSubtitles;