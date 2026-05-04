import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  List as ListIcon, 
  TrendingUp, 
  Search, 
  X, 
  Calendar, 
  DollarSign, 
  BarChart2, 
  Building2,
  Info,
  RefreshCw,
  Clock,
  AlertCircle
} from 'lucide-react';

// --- 靜態基本資料設定庫 ---
// (保留名稱、配息頻率等不會變動的基本資料)
const etfBaseConfig = [
  { id: '00401A', name: '摩根台灣鑫收益', company: '摩根', frequency: '月配', months: [1,2,3,4,5,6,7,8,9,10,11,12], listDate: '2026/04', type: '台股', desc: '目前市場唯一主動式月配息ETF。', mockPrice: 15.2, mockPerf: '+1.3%' },
  { id: '00403A', name: '統一台股升級50', company: '統一', frequency: '季配', months: [1,4,7,10], listDate: '2025/08', type: '台股', desc: '聚焦台灣升級轉型之50大企業。', mockPrice: 18.5, mockPerf: '+23.3%' },
  { id: '00984A', name: '安聯台灣高息成長', company: '安聯', frequency: '季配', months: [1,4,7,10], listDate: '2025/07', type: '台股', desc: '結合高股息與企業成長雙引擎的主動選股。', mockPrice: 19.1, mockPerf: '+27.3%' },
  { id: '00989A', name: '摩根大美國領先科技', company: '摩根', frequency: '季配', months: [1,4,7,10], listDate: '2025/10', type: '美股', desc: '投資美國尖端科技巨頭與潛力股。', mockPrice: 16.8, mockPerf: '+12.0%' },
  { id: '00992A', name: '群益台灣科技創新', company: '群益', frequency: '季配', months: [1,4,7,10], listDate: '2025/12', type: '台股', desc: '主攻台灣半導體與AI創新科技產業。', mockPrice: 17.3, mockPerf: '+15.3%' },
  { id: '00995A', name: '中信台灣卓越成長', company: '中信', frequency: '季配', months: [1,4,7,10], listDate: '2025/11', type: '台股', desc: '挖掘台灣具備卓越成長動能之企業。', mockPrice: 16.5, mockPerf: '+10.0%' },
  { id: '00997A', name: '群益美國增長', company: '群益', frequency: '季配', months: [1,4,7,10], listDate: '2026/02', type: '美股', desc: '聚焦美國高成長企業的主動式管理。', mockPrice: 15.5, mockPerf: '+3.3%' },
  // 💡 把 00980A 改成 0050 測試真實資料抓取
  { id: '0050', name: '元大台灣50 (測試用)', company: '元大', frequency: '半年配', months: [1,7], listDate: '2003/06', type: '台股', desc: '測試真實資料連線。', mockPrice: 150.0, mockPerf: '+0.0%' },
  { id: '00982A', name: '群益台灣精選強棒', company: '群益', frequency: '季配', months: [2,5,8,11], listDate: '2025/05', type: '台股', desc: '本土投信首發，靈活操作強勢股。', mockPrice: 21.0, mockPerf: '+40.0%' },
  { id: '00981A', name: '統一台股增長', company: '統一', frequency: '季配', months: [3,6,9,12], listDate: '2025/05', type: '台股', desc: '明星經理人操盤，上市一年績效稱霸市場。', mockPrice: 28.2, mockPerf: '+88.0%' },
  { id: '00994A', name: '第一金台股趨勢優選', company: '第一金', frequency: '季配', months: [3,6,9,12], listDate: '2026/01', type: '台股', desc: '順應台股長線趨勢進行優選配置。', mockPrice: 15.3, mockPerf: '+2.0%' },
  { id: '00996A', name: '兆豐台灣豐收', company: '兆豐', frequency: '季配', months: [0], listDate: '2026/04', type: '台股', desc: '首創期貨避險機制，月份依各季公告為主。', mockPrice: 15.0, mockPerf: '--' },
  { id: '00991A', name: '復華台灣未來50', company: '復華', frequency: '半年配', months: [6,12], listDate: '2025/12', type: '台股', desc: '著眼台灣未來50大潛力企業。', mockPrice: 16.8, mockPerf: '+12.0%' },
  { id: '00983A', name: '中信ARK創新', company: '中信', frequency: '年配', months: [12], listDate: '2025/10', type: '海外', desc: '引進ARK木頭姐策略之主動ETF。', mockPrice: 15.8, mockPerf: '+5.3%' },
  { id: '00985A', name: '野村台灣50', company: '野村', frequency: '年配', months: [12], listDate: '2025/07', type: '台股', desc: '主動操作版本的台灣50大權值股。', mockPrice: 19.5, mockPerf: '+30.0%' },
  { id: '00986A', name: '台新全球龍頭成長', company: '台新', frequency: '年配', months: [11], listDate: '2025/11', type: '海外', desc: '投資全球各產業龍頭企業。', mockPrice: 16.2, mockPerf: '+8.0%' },
  { id: '00987A', name: '台新台灣優勢成長', company: '台新', frequency: '年配', months: [11], listDate: '2025/10', type: '台股', desc: '發掘台灣具備全球競爭優勢的成長股。', mockPrice: 16.0, mockPerf: '+6.6%' },
  { id: '00988A', name: '統一全球創新', company: '統一', frequency: '年配', months: [10], listDate: '2025/12', type: '海外', desc: '放眼全球創新產業鏈。', mockPrice: 17.5, mockPerf: '+16.6%' },
  { id: '00993A', name: '安聯台灣主動式', company: '安聯', frequency: '年配', months: [1], listDate: '2026/02', type: '台股', desc: '安聯台股團隊的主動選股精華。', mockPrice: 15.1, mockPerf: '+0.6%' },
  { id: '00990A', name: '元大全球AI新經濟', company: '元大', frequency: '不配息', months: [], listDate: '2025/09', type: '海外', desc: '不配息滾入再投資，追求AI產業長期複利。', mockPrice: 18.2, mockPerf: '+21.3%' },
];

// --- 顏色配置邏輯 ---
const getBadgeColor = (freq, months) => {
  if (freq === '月配') return 'bg-orange-100 text-orange-800 border-orange-200';
  if (freq === '半年配') return 'bg-red-100 text-red-800 border-red-200';
  if (freq === '年配') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (freq === '不配息') return 'bg-gray-100 text-gray-800 border-gray-200';
  if (freq === '季配') {
    if (months.includes(1)) return 'bg-green-100 text-green-800 border-green-200';
    if (months.includes(2)) return 'bg-teal-100 text-teal-800 border-teal-200';
    if (months.includes(3)) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  }
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

// --- 主應用程式 ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedETF, setSelectedETF] = useState(null);
  const [etfData, setEtfData] = useState(etfBaseConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [apiError, setApiError] = useState(false);

  // 抓取真實市場資料 (具備多重備援機制的 Fetch)
  const fetchMarketData = async () => {
    setIsLoading(true);
    setApiError(false);
    
    try {
      const twseUrl = 'https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL';
      
      // 建立備援陣列：直接連線 -> corsproxy.io -> allorigins
      // 這樣可以最大程度避免 Failed to fetch 問題
      const fetchTargets = [
        twseUrl,
        `https://corsproxy.io/?${encodeURIComponent(twseUrl)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(twseUrl)}`
      ];

      let realData = null;

      // 依序嘗試連線，只要其中一個成功拿到資料就停止嘗試
      for (const target of fetchTargets) {
        try {
          const response = await fetch(target, { cache: 'no-store' }); // 避免快取舊資料
          if (response.ok) {
            const data = await response.json();
            // 驗證回傳的資料確實是陣列 (避免有些代理出錯回傳 HTML)
            if (Array.isArray(data) && data.length > 0) {
              realData = data;
              console.log("成功從以下節點取得資料:", target);
              break;
            }
          }
        } catch (e) {
          console.warn(`嘗試從 ${target} 抓取失敗，自動切換下一個節點...`);
          // 靜默失敗，迴圈會自動進入下一個 target
        }
      }

      if (!realData) {
        throw new Error('所有備援節點皆無法連線取資料');
      }
      
      // 將資料轉換為 Map 方便快速查找 (Key: 股票代號)
      const realDataMap = {};
      realData.forEach(item => {
        realDataMap[item.Code] = {
          price: parseFloat(item.ClosingPrice) || '-',
          change: parseFloat(item.Change) || 0,
        };
      });

      // 將真實資料合併到我們的設定庫中
      const mergedData = etfBaseConfig.map(etf => {
        const marketInfo = realDataMap[etf.id];
        if (marketInfo && marketInfo.price !== '-') {
          // 如果證交所有這檔 ETF 的資料
          const changePercent = ((marketInfo.change / (marketInfo.price - marketInfo.change)) * 100).toFixed(2);
          const formattedChange = changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`;
          
          return {
            ...etf,
            price: marketInfo.price.toFixed(2),
            perf: formattedChange,
            isReal: true // 標記為真實抓取資料
          };
        } else {
          // 如果尚未上市或查無資料，使用模擬參考價
          return {
            ...etf,
            price: etf.mockPrice.toFixed(2),
            perf: etf.mockPerf,
            isReal: false
          };
        }
      });

      setEtfData(mergedData);
      setLastUpdated(new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error("無法抓取真實資料，使用模擬預設值", error);
      setApiError(true);
      // 發生錯誤時填入預設模擬資料
      setEtfData(etfBaseConfig.map(etf => ({ 
        ...etf, 
        price: etf.mockPrice.toFixed(2), 
        perf: etf.mockPerf, 
        isReal: false 
      })));
    } finally {
      setIsLoading(false);
    }
  };

  // 組件載入時自動抓取一次
  useEffect(() => {
    fetchMarketData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-900">
      {/* 標題列 */}
      <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                台股主動 ETF 
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
              {isLoading ? (
                <span className="flex items-center gap-1 animate-pulse"><RefreshCw className="w-3 h-3 animate-spin"/> 資料同步中...</span>
              ) : (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3"/> 最新更新: {lastUpdated || '未同步'}
                  {apiError && <AlertCircle className="w-3 h-3 text-red-400 ml-1" title="API 錯誤，顯示離線資料" />}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* 手動更新按鈕 */}
        <button 
          onClick={fetchMarketData}
          disabled={isLoading}
          className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* 主要內容區 */}
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'dashboard' && <DashboardView onSelectETF={setSelectedETF} etfData={etfData} />}
        {activeTab === 'list' && <ListView onSelectETF={setSelectedETF} etfData={etfData} />}
      </main>

      {/* PWA 底部導覽列 */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around pb-safe z-20">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-3 w-full transition-colors ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">總覽</span>
        </button>
        <button 
          onClick={() => setActiveTab('list')}
          className={`flex flex-col items-center p-3 w-full transition-colors ${activeTab === 'list' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ListIcon className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">即時行情</span>
        </button>
      </nav>

      {/* ETF 詳細資訊彈出視窗 */}
      {selectedETF && (
        <DetailModal etf={selectedETF} onClose={() => setSelectedETF(null)} />
      )}
    </div>
  );
}

// --- 總覽視圖 (Dashboard) ---
function DashboardView({ onSelectETF, etfData }) {
  const totalETFs = etfData.length;
  // 篩選出真實市場資料並依漲幅排序，若無真實資料則依模擬資料排序
  const topPerformers = [...etfData]
    .sort((a, b) => parseFloat(b.perf) - parseFloat(a.perf))
    .slice(0, 5);
  
  const freqCount = etfData.reduce((acc, etf) => {
    acc[etf.frequency] = (acc[etf.frequency] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* 頂部數據卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<BarChart2 />} title="總發行檔數" value={totalETFs} subtitle="上市與募集中" color="bg-blue-50 text-blue-600" />
        <StatCard icon={<Building2 />} title="參戰投信" value="11 家" subtitle="資產管理業大戰" color="bg-purple-50 text-purple-600" />
        <StatCard icon={<DollarSign />} title="月配息" value={freqCount['月配'] || 0} subtitle="現金流首選" color="bg-orange-50 text-orange-600" />
        <StatCard icon={<TrendingUp />} title="不配息" value={freqCount['不配息'] || 0} subtitle="純抱複利" color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* 績效領先群 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-500"/> 今日表現領先群
        </h3>
        <div className="space-y-3">
          {topPerformers.map((etf, idx) => (
            <div 
              key={etf.id} 
              onClick={() => onSelectETF(etf)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition border border-transparent hover:border-indigo-100"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm
                  ${idx === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : 
                    idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 
                    idx === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500' : 'bg-indigo-200 text-indigo-700'}`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {etf.id} {etf.name}
                    {etf.isReal ? 
                      <span className="w-2 h-2 rounded-full bg-green-500" title="即時真實報價"></span> : 
                      <span className="w-2 h-2 rounded-full bg-yellow-400" title="模擬參考價"></span>
                    }
                  </div>
                  <div className="text-xs text-gray-500">{etf.company}投信 · {etf.listDate} 上市</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${parseFloat(etf.perf) > 0 ? 'text-red-500' : parseFloat(etf.perf) < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  {etf.perf}
                </div>
                <div className="text-xs font-medium text-gray-600">${etf.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 配息頻率分佈 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500"/> 配息頻率策略分佈
        </h3>
        <div className="flex flex-col gap-3">
          {Object.entries(freqCount).map(([freq, count]) => {
            const percentage = (count / totalETFs) * 100;
            return (
              <div key={freq} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium text-gray-600">{freq}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-bold text-gray-800">{count} 檔</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between transition hover:shadow-md">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-gray-800">{value}</div>
        <div className="text-sm font-bold text-gray-600">{title}</div>
        <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{subtitle}</div>
      </div>
    </div>
  );
}

// --- 列表視圖 (List) ---
function ListView({ onSelectETF, etfData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFreq, setFilterFreq] = useState('全部');

  const frequencies = ['全部', '月配', '季配', '半年配', '年配', '不配息'];

  const filteredData = useMemo(() => {
    return etfData.filter(etf => {
      const matchSearch = etf.id.includes(searchTerm) || etf.name.includes(searchTerm) || etf.company.includes(searchTerm);
      const matchFreq = filterFreq === '全部' || etf.frequency === filterFreq;
      return matchSearch && matchFreq;
    });
  }, [searchTerm, filterFreq, etfData]);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col h-full animate-in fade-in duration-300">
      {/* 搜尋與篩選列 */}
      <div className="sticky top-0 bg-gray-50 pt-2 pb-4 z-10">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="搜尋代號、名稱或投信 (如: 00981A, 統一)" 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* 橫向滾動篩選按鈕 */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {frequencies.map(freq => (
            <button
              key={freq}
              onClick={() => setFilterFreq(freq)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border shadow-sm
                ${filterFreq === freq 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      {/* ETF 卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {filteredData.length > 0 ? (
          filteredData.map(etf => (
            <div 
              key={etf.id}
              onClick={() => onSelectETF(etf)}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-black text-gray-800 group-hover:text-indigo-600 transition-colors">{etf.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getBadgeColor(etf.frequency, etf.months)}`}>
                    {etf.frequency} {etf.frequency === '季配' && etf.months.length > 1 ? `(${etf.months[0]},${etf.months[1]}...)` : ''}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-700">{etf.name}</div>
                <div className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-medium">{etf.company}</span>
                  <span>上市: {etf.listDate}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800 flex items-center justify-end gap-1">
                  ${etf.price}
                  {etf.isReal && <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="真實報價"></span>}
                </div>
                <div className={`text-sm font-bold ${parseFloat(etf.perf) > 0 ? 'text-red-500' : parseFloat(etf.perf) < 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {etf.perf}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400">
            <Search className="w-12 h-12 mb-3 text-gray-300" />
            <p>找不到符合條件的 ETF</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 詳細資訊彈出視窗 (Modal) ---
function DetailModal({ etf, onClose }) {
  const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full sm:w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-start p-5 bg-gray-50 border-b border-gray-100 relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black text-gray-900">{etf.id}</span>
              <span className={`text-xs px-2 py-1 rounded border font-bold shadow-sm ${getBadgeColor(etf.frequency, etf.months)}`}>
                {etf.frequency}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-700">{etf.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {/* 數據區塊 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="text-xs text-gray-500 mb-1 font-medium flex items-center gap-1">
                最新報價 
                {etf.isReal ? <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">真實</span> : <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold">模擬</span>}
              </div>
              <div className="text-2xl font-black text-gray-800">${etf.price}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-500 mb-1 font-medium">成立至今表現</div>
              <div className={`text-2xl font-black ${parseFloat(etf.perf) > 0 ? 'text-red-500' : parseFloat(etf.perf) < 0 ? 'text-green-600' : 'text-gray-800'}`}>
                {etf.perf}
              </div>
            </div>
          </div>

          {/* 除息月份視覺化 */}
          <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" /> 預估除息月份 <span className="text-xs font-normal text-gray-400">(綠色為配息月)</span>
            </h3>
            {etf.frequency === '不配息' ? (
              <div className="p-4 bg-white rounded-xl text-center text-sm text-gray-600 font-medium border border-gray-100 shadow-sm">
                💡 此標的為不配息設計，收益直接滾入淨值創造複利。
              </div>
            ) : etf.months[0] === 0 ? (
              <div className="p-4 bg-white rounded-xl text-center text-sm text-gray-600 font-medium border border-gray-100 shadow-sm">
                📌 配息月份依據投信公司各季公告為準。
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-2">
                {allMonths.map(m => {
                  const isDividendMonth = etf.months.includes(m);
                  return (
                    <div 
                      key={m} 
                      className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all
                        ${isDividendMonth 
                          ? 'bg-green-100 border-green-300 text-green-800 font-black shadow-sm ring-1 ring-green-200' 
                          : 'bg-white border-gray-200 text-gray-400 font-medium'}`}
                    >
                      <span className="text-xs">{m}月</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 基本資料 */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-500" /> 基金投資策略
            </h3>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100 mb-4 shadow-sm">
              <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                {etf.desc}
              </p>
            </div>
            
            <div className="space-y-1 bg-white border border-gray-100 rounded-2xl p-2 shadow-sm">
              <div className="flex justify-between py-2.5 px-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-gray-500 text-sm font-medium">發行投信</span>
                <span className="font-bold text-gray-800 text-sm">{etf.company}投信</span>
              </div>
              <div className="flex justify-between py-2.5 px-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-gray-500 text-sm font-medium">投資區域/類型</span>
                <span className="font-bold text-gray-800 text-sm">{etf.type}</span>
              </div>
              <div className="flex justify-between py-2.5 px-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-gray-500 text-sm font-medium">掛牌日期</span>
                <span className="font-bold text-gray-800 text-sm">{etf.listDate}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer actions */}
        <div className="p-4 bg-white border-t border-gray-100">
          <button 
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all active:scale-[0.98] shadow-md shadow-indigo-200"
            onClick={onClose}
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
}