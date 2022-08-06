const positionCursorFocus = (target) => {
  if (target.innerText === "emptyName") target.innerText = "";
  const setpos = document.createRange();
  const set = window.getSelection();
  if (isNotUndefined(target.childNodes[0]))
    setpos.setStart(target.childNodes[0], target.innerText.length);
  setpos.collapse(true);
  set.removeAllRanges();
  set.addRange(setpos);
  target.focus();
};

const isChromeBrowser = ({ browser = getBrowserType() } = {}) =>
  browser === CHROME;

const leadershipBoardFriendSchema = ({
  id,
  name,
  score,
  isAdmin = false,
  isSelf = false,
  isFriend = true,
} = {}) => ({
  id: id,
  name: name,
  score: score,
  isAdmin: isAdmin,
  isSelf: isSelf,
  isFriend: isFriend,
});

const leadershipBoardGroupSchema = ({
  id = "",
  name = "",
  score = 0,
  members = [],
  isAdmin = false,
} = {}) => ({
  id: id,
  name: name,
  score: score,
  members: members,
  isAdmin: isAdmin,
});

const fetchQuery = ({ endpoint, parameters, timeout = 0 } = {}) =>
  axios
    .post(endpoint, parameters, { timeout: timeout })
    .then((response) => response.data)
    .catch((error) => (error.response?.data ? error.response.data : error));

const copyToClipboard = (ref) => {
  const input = ref.current;
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value);
};

const copyValueToClipboard = (value) => {
  navigator.clipboard.writeText(value);
};

const validUserId = (userId) => !!userId && userId.length > 20;

const arrayNotEmpty = (array) => array?.length > 0;

const stringNotEmpty = (string) => string?.length > 0;

const isNotNull = (value) => value !== null;

const isNull = (value) => value === null;

const isNotUndefined = (value) => value !== undefined;

const isBoolean = (value) => value === true || value === false;

// removed from leadership board
const getTreesSavedFromTabsOpened = (tabs) => Math.floor(tabs / 5);

const NumberFloor = (number) => Math.floor(number);

const getTotalTreesSaved = () => {
  const initialDate = SAVING_TREES_RATE_CHANGED_DATE;
  const instant = new Date();
  const finalDate = new Date(
    instant.getUTCFullYear(),
    instant.getUTCMonth(),
    instant.getUTCDate(),
    instant.getUTCHours(),
    instant.getUTCMinutes(),
    instant.getUTCSeconds()
  );
  return Math.floor(
    GLOBAL_TREES_SAVED_TILL_CHANGED_DATE +
      Math.floor(
        (finalDate - initialDate) / 1000 / DEFAULT_SECONDS_PER_TREE_SAVED
      )
  );
};

const getDefaultTotalTreesSaved = () => {
  const initialDate = SAVING_TREES_RATE_CHANGED_DATE;
  const instant = new Date();
  const finalDate = new Date(
    instant.getUTCFullYear(),
    instant.getUTCMonth(),
    instant.getUTCDate(),
    instant.getUTCHours(),
    instant.getUTCMinutes(),
    instant.getUTCSeconds()
  );
  return (
    GLOBAL_TREES_SAVED_TILL_CHANGED_DATE +
    Math.floor(
      (finalDate - initialDate) / 1000 / DEFAULT_SECONDS_PER_TREE_SAVED
    )
  );
};

const addCommas = (number) =>
  number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const sumOfScoresInList = (list) =>
  list
    .map((object) => object.score)
    .reduce((score, accumulator) => score + accumulator, 0);

const numberOfAdsToTreeSaved = (numberOfAds) => {
  switch (numberOfAds) {
    case 0: {
      return 1 / 50;
    }
    case 1: {
      return 1 / 10;
    }
    case 2: {
      return 1 / 8;
    }
    case 3: {
      return 1 / 5;
    }
    default: {
      // Return treesSaved itself, if source is sponsored-survey
      return numberOfAds;
    }
  }
};

const numberOfAdsToTreeSavedSource = (numberOfAds) => {
  return 1;
};

const incrementTreesSaved = ({ user, advertisementCount, adsWhitelisted }) => {
  const { treesSaved } = user;
  const treeSaved = adsWhitelisted
    ? numberOfAdsToTreeSaved(advertisementCount)
    : numberOfAdsToTreeSaved(0);
  let updatedTreesSaved = treesSaved + treeSaved;
  if (getPercentageOfTreeSaved(updatedTreesSaved) > 95 && adsWhitelisted)
    updatedTreesSaved = Math.ceil(updatedTreesSaved);
  user = { ...user, treesSaved: updatedTreesSaved };
  return user;
};

const getPercentageOfTreeSaved = (treesSaved) => {
  const lowerBit = Math.floor(treesSaved);
  const percent = (treesSaved - lowerBit) * 100;
  return +percent.toFixed(0);
};

const isVowel = (word) =>
  word !== undefined
    ? ["a", "e", "i", "o", "u"].indexOf(word.charAt(0).toLowerCase()) !== -1
    : false;

const getReferralCount = (referrals) => referrals?.length;

const sumOfTreesInList = (list) =>
  list
    .map((object) => object.treesSaved)
    .reduce((score, accumulator) => score + accumulator, 0);

const treesToCO2Stored = (trees) => NumberFloor(trees * CO2_STORED_PER_TREE);

const setLocalStorage = (key, value) => localStorage.setItem(key, value);

const getLocalStorage = (key) => localStorage.getItem(key);

//const getTabsOpenedTodayFromStorage = () => {
// 	const tabsOpenedString = localStorage.getItem(STORAGE_RECENT_DAY_TABS_OPENED);
// 	const tabsOpenedParsed = parseInt(tabsOpenedString, 10);
// 	const tabsOpened = isNaN(tabsOpenedParsed) ? 0 : tabsOpenedParsed;
// 	return tabsOpened;
// };

function getBrowserType() {
  const userDeviceDetails = navigator.userAgent;
  const userAgentString = userDeviceDetails;
  let chromeAgent = userAgentString.indexOf("Chrome") > -1;
  let edgeAgent = userAgentString.indexOf("Edg") > -1;
  let firefoxAgent = userAgentString.indexOf("Firefox") > -1;
  let safariAgent = userAgentString.indexOf("Safari") > -1;

  // Discard Chrome since it also matches Edge
  if (chromeAgent && edgeAgent) chromeAgent = false;
  // Discard Safari since it also matches Chrome
  if (chromeAgent && safariAgent) safariAgent = false;

  return chromeAgent
    ? "chrome"
    : edgeAgent
    ? "edge"
    : firefoxAgent
    ? "firefox"
    : safariAgent
    ? "safari"
    : "chrome";
}

function getPostHeader(data) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}

const globe = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.7673 2.86279L14.9668 3.07188L11.9993 4.02229L2.69768 7.00113L0.0341797 12.6914C0.394253 18.9953 5.60525 24.0002 11.9993 24.0002C18.6267 24.0002 23.9993 18.6275 23.9993 12.0001C23.9993 8.33772 22.3538 5.06396 19.7673 2.86279Z"
      fill="#4DA6FF"
    />
    <path
      d="M24 12.0001C24 8.33772 22.3545 5.06396 19.7679 2.86279L14.9675 3.07188L12 4.02229V24.0002C18.6274 24.0002 24 18.6275 24 12.0001Z"
      fill="#1A8CCA"
    />
    <path
      d="M15.8759 15.2726L12.0002 13.111L11.492 12.8276L8.48242 15.8372L11.1373 20.9584L12.0002 20.68L18.5456 18.5687V15.2726H15.8759Z"
      fill="#3EDDB0"
    />
    <path
      d="M18.5455 15.2724H15.8757L12 13.1108V20.6799L18.5455 18.5686V15.2724Z"
      fill="#28AF89"
    />
    <path
      d="M12 0C5.37267 0 0 5.37252 0 12C0 12.2333 0.021673 12.4612 0.0349094 12.6913L5.66976 15.5093L9.17901 12L6.54547 9.3665V8.7273H10.2699L12 6.99718L16.8825 9.11508L19.768 2.8627C17.6741 1.08066 14.965 0 12 0Z"
      fill="#3EDDB0"
    />
    <path
      d="M16.8825 9.11508L19.7679 2.8627C17.6741 1.08066 14.965 0 12 0V6.99718L16.8825 9.11508Z"
      fill="#28AF89"
    />
  </svg>
);

const DEFAULT_SECONDS_PER_TREE_SAVED = 25;
const DEFAULT_SECONDS_PER_TAB_OPENED = 1;
const STORAGE_SECONDS_PER_TAB_OPENED = "secondsPerTabOpened";

const tab = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="svg-fill"
      d="M32 16C32 24.8367 24.8367 32 16 32C7.16333 32 0 24.8367 0 16C0 7.16333 7.16333 0 16 0C24.8367 0 32 7.16333 32 16Z"
    />
    <path d="M5.125 7.08472H26.875V23.875H5.125V7.08472Z" fill="#E6E6E6" />
    <path d="M6 13H26V23H6V13Z" fill="white" />
    <path
      d="M20.666 18H24.666V22H20.666V18Z"
      fill="#E6E6E6"
      fillOpacity="0.3"
    />
    <path
      d="M8 10C8 10.5522 7.55225 11 7 11C6.44775 11 6 10.5522 6 10C6 9.44775 6.44775 9 7 9C7.55225 9 8 9.44775 8 10Z"
      fill="#FE6A16"
    />
    <path
      d="M11 10C11 10.5522 10.5522 11 10 11C9.44775 11 9 10.5522 9 10C9 9.44775 9.44775 9 10 9C10.5522 9 11 9.44775 11 10Z"
      fill="#FFD400"
    />
    <path
      d="M14 10C14 10.5522 13.5522 11 13 11C12.4478 11 12 10.5522 12 10C12 9.44775 12.4478 9 13 9C13.5522 9 14 9.44775 14 10Z"
      fill="#09CE67"
    />
    <path d="M16 9H26V11H16V9Z" fill="white" />
  </svg>
);

const colourLogo = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="svg-fill"
      d="M32 16C32 24.8367 24.8367 32 16 32C7.16333 32 0 24.8367 0 16C0 7.16333 7.16333 0 16 0C24.8367 0 32 7.16333 32 16Z"
    />
    <path
      d="M25.9534 17.254C23.1919 17.6772 21.1066 19.088 19.6131 21.4298C19.444 21.6837 19.5286 21.8248 19.8104 21.8812C20.2331 21.9377 20.6276 21.9659 21.0502 22.0223C23.5864 21.9941 25.8407 20.1883 26.4324 17.7337C26.517 17.2822 26.4325 17.1694 25.9534 17.254Z"
      fill="white"
    />
    <path
      d="M22.346 16.9719C22.515 16.8872 22.6559 16.5768 22.6559 16.3793C22.6559 15.0533 22.3741 13.7836 21.8106 12.5421C21.6415 12.1753 21.3879 12.1471 21.1061 12.3728C20.6834 12.6832 20.2607 12.9654 19.8944 13.3322C18.1473 14.9686 17.4428 17.9312 18.7109 20.0473C19.0772 19.9062 19.3872 19.3701 19.669 19.0597C20.458 18.2415 21.3033 17.5361 22.346 16.9719Z"
      fill="white"
    />
    <path
      d="M17.1893 19.765C16.823 19.0032 16.6539 18.1286 16.6539 17.2821C16.6539 16.21 16.9357 15.1942 17.4429 14.3478C17.7247 13.8681 18.0629 13.4167 18.4855 13.0499C18.7391 12.7113 18.7673 12.3728 18.5983 11.9778C18.1192 10.8774 17.5274 9.86165 16.7103 8.98699C16.2594 8.53556 16.203 8.53556 15.9212 9.09985C14.5123 12.0624 14.2587 15.0532 15.1322 18.0721C15.1886 18.2414 15.2168 18.4107 15.2731 18.5518C15.3577 18.7775 15.414 18.975 15.4986 19.2007C15.5831 19.4547 15.6395 19.7368 15.724 19.9908C17.1893 24.364 15.1604 27.8627 13.9487 30.1199C13.8078 30.402 13.4978 30.7688 14.146 30.797C15.1604 30.8252 16.203 30.8252 17.2175 30.797C17.3584 30.797 17.5556 30.5431 17.6402 30.4302C18.4855 29.0477 19.5282 25.4644 18.6828 23.2637C18.2037 22.0222 17.7529 20.9501 17.1893 19.765Z"
      fill="white"
    />
    <path
      d="M13.6385 17.8747C13.7512 17.9029 13.9484 17.9311 14.0048 17.8465C14.0611 17.7618 14.0611 17.5925 14.0048 17.4797C13.5257 16.1254 13.3285 14.7146 13.4694 13.2757C13.4976 13.0782 13.3285 12.796 13.1594 12.6832C12.2577 12.0342 11.2714 11.6392 10.2006 11.4135C9.86246 11.3288 9.69338 11.4417 9.6652 11.7803C9.55249 13.2474 9.66521 14.5171 10.5388 15.7303C11.2996 16.7743 12.3986 17.5361 13.6385 17.8747Z"
      fill="white"
    />
    <path
      d="M15.1045 22.4173C15.2172 22.1916 15.189 21.9659 15.1608 21.7119C15.0763 20.9501 14.7663 20.1601 14.2027 19.6522C12.8783 18.4672 10.9058 18.834 9.94769 17.0565C9.72226 16.6615 9.58137 16.1818 9.18686 15.9561C8.98961 15.8433 8.76417 15.7868 8.53874 15.7586C7.46793 15.6175 6.36895 15.674 5.32633 15.8997C4.93182 15.9843 4.79093 16.1536 4.96 16.6051C5.66448 18.6365 7.12979 20.3858 8.9896 21.458C9.94769 21.9941 10.9621 22.3891 12.0611 22.5866C12.5965 22.643 14.8227 23.038 15.1045 22.4173Z"
      fill="white"
    />
  </svg>
);

const cloud = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M32 16C32 24.8367 24.8367 32 16 32C7.16333 32 0 24.8367 0 16C0 7.16333 7.16333 0 16 0C24.8367 0 32 7.16333 32 16Z"
      className="svg-fill"
    />
    <path
      d="M10.3545 8.47927C10.3545 8.7554 10.1306 8.97927 9.85449 8.97927C9.57837 8.97927 9.35449 8.7554 9.35449 8.47927C9.35449 8.20315 9.57837 7.97927 9.85449 7.97927C10.1306 7.97927 10.3545 8.20315 10.3545 8.47927Z"
      fill="#09CE67"
    />
    <path
      d="M25.7254 13.7071C25.8766 13.4047 25.9521 13.052 25.9521 12.6992C25.9521 11.3638 24.8687 10.3055 23.5584 10.3055C23.5332 10.3055 23.508 10.3055 23.4829 10.3055C22.8529 7.937 20.7112 6.19842 18.1411 6.19842C16.3521 6.19842 14.7647 7.05511 13.7317 8.36535C13.1269 8.03779 12.4466 7.86141 11.7159 7.86141C9.32222 7.86141 7.35687 9.80157 7.35687 12.2205C7.35687 12.5984 7.40726 12.9512 7.48285 13.2787C5.29073 13.6567 3.60254 15.5968 3.60254 17.915C3.60254 20.5102 5.71907 22.6268 8.31435 22.6268H23.6592C26.2545 22.6268 28.371 20.5102 28.371 17.915C28.371 16.1008 27.2876 14.4882 25.7254 13.7071Z"
      fill="white"
    />
    <path
      d="M11.8674 13.5559C12.4217 13.5559 12.8752 13.7827 13.228 14.2362L13.9587 13.4299C13.3792 12.7748 12.6737 12.4473 11.817 12.4473C11.0611 12.4473 10.4059 12.6992 9.87681 13.2284C9.34767 13.7323 9.0957 14.3874 9.0957 15.1433C9.0957 15.9244 9.34767 16.5543 9.87681 17.0583C10.4059 17.5622 11.0611 17.8142 11.8422 17.8142C12.6233 17.8142 13.3288 17.4866 13.9335 16.8315L13.2028 16.0756C12.85 16.5291 12.3713 16.7559 11.817 16.7559C11.4138 16.7559 11.0359 16.6047 10.7587 16.3276C10.4563 16.0252 10.3303 15.6473 10.3303 15.1685C10.3303 14.6898 10.4815 14.3118 10.7839 14.0095C11.0611 13.6819 11.439 13.5559 11.8674 13.5559Z"
      className="svg-fill"
    />
    <path
      d="M17.1588 12.4473C16.4029 12.4473 15.7477 12.6992 15.2186 13.2032C14.6895 13.7071 14.4375 14.3622 14.4375 15.1181C14.4375 15.874 14.6895 16.5291 15.2186 17.0331C15.7477 17.537 16.3777 17.789 17.1588 17.789C17.9399 17.789 18.5698 17.537 19.0989 17.0331C19.6281 16.5291 19.88 15.874 19.88 15.1181C19.88 14.3622 19.6281 13.7071 19.0989 13.2032C18.5698 12.6992 17.9399 12.4473 17.1588 12.4473ZM18.2674 16.3024C17.9651 16.6299 17.6123 16.7811 17.184 16.7811C16.7556 16.7811 16.3777 16.6299 16.1005 16.3024C15.7981 15.9748 15.647 15.5969 15.647 15.1181C15.647 14.6646 15.7981 14.2614 16.1005 13.9339C16.4029 13.6063 16.7556 13.4551 17.184 13.4551C17.6123 13.4551 17.9903 13.6063 18.2674 13.9339C18.5698 14.2614 18.721 14.6646 18.721 15.1181C18.721 15.5969 18.5698 15.9748 18.2674 16.3024Z"
      className="svg-fill"
    />
    <path
      d="M21.543 18.0662L22.1478 17.4362C22.3997 17.1843 22.5509 16.9827 22.6517 16.8063C22.7525 16.6551 22.7777 16.4788 22.7777 16.3024C22.7777 15.9748 22.6769 15.7229 22.4501 15.5465C22.2233 15.3701 21.9714 15.2693 21.669 15.2693C21.3667 15.2693 21.1399 15.3449 20.9383 15.4709C20.7367 15.5969 20.5604 15.7984 20.4092 16.0252L21.0139 16.378C21.2155 16.0756 21.4171 15.9244 21.6186 15.9244C21.7446 15.9244 21.8202 15.9748 21.8958 16.0504C21.9714 16.126 21.9966 16.2268 21.9966 16.3276C21.9966 16.4536 21.9462 16.5543 21.8706 16.6803C21.795 16.8063 21.6438 16.9575 21.4422 17.1843L20.4344 18.2173V18.7969H22.8533V18.1166H21.543V18.0662Z"
      className="svg-fill"
    />
  </svg>
);

const tiktokLogo = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 21 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="social-icon"
  >
    <path d="M7.8749 19.2904C9.75378 19.2904 11.2769 17.9452 11.2769 15.8883V0.629639H15.3569C15.1281 3.4124 17.8944 6.10048 20.9452 6.03901V9.87556C18.3361 9.87556 16.1175 8.77235 15.3453 8.1601V15.8883C15.3453 19.2904 12.669 23.1482 7.8749 23.1482C3.0808 23.1482 0.462891 19.2904 0.462891 15.8883C0.462891 11.0867 5.54425 8.30193 8.90973 8.98256V12.8903C8.74043 12.8304 8.30382 12.7419 7.93193 12.7419C6.03743 12.672 4.47287 14.2086 4.47287 15.8883C4.47287 17.7672 5.99601 19.2904 7.8749 19.2904Z" />
  </svg>
);

const facebookLogo = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="social-icon"
  >
    <path d="M14.6714 0.499672H1.32433C1.10558 0.499672 0.89578 0.586572 0.741096 0.741256C0.586412 0.89594 0.499512 1.10574 0.499512 1.32449V14.6716C0.499512 14.7799 0.520846 14.8871 0.562297 14.9872C0.603749 15.0873 0.664504 15.1782 0.741096 15.2548C0.817688 15.3314 0.908615 15.3922 1.00869 15.4336C1.10876 15.4751 1.21601 15.4964 1.32433 15.4964H8.50776V9.68517H6.55819V7.43566H8.50776V5.74853C8.46738 5.35243 8.51414 4.95229 8.64477 4.57618C8.7754 4.20007 8.98673 3.8571 9.26395 3.57131C9.54116 3.28552 9.87754 3.06384 10.2495 2.92182C10.6215 2.7798 11.02 2.72088 11.4171 2.74918C12.0007 2.74559 12.5841 2.77563 13.1642 2.83916V4.86372H11.972C11.0272 4.86372 10.8473 5.31362 10.8473 5.96598V7.41316H13.0968L12.8043 9.66267H10.8473V15.4964H14.6714C14.7797 15.4964 14.887 15.4751 14.9871 15.4336C15.0871 15.3922 15.1781 15.3314 15.2547 15.2548C15.3312 15.1782 15.392 15.0873 15.4335 14.9872C15.4749 14.8871 15.4962 14.7799 15.4962 14.6716V1.32449C15.4962 1.21617 15.4749 1.10892 15.4335 1.00885C15.392 0.908775 15.3312 0.817848 15.2547 0.741256C15.1781 0.664665 15.0871 0.603909 14.9871 0.562458C14.887 0.521007 14.7797 0.499672 14.6714 0.499672V0.499672Z" />
  </svg>
);

const messengerLogo = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="social-icon"
  >
    <path d="M7.98084 0.499673C7.00559 0.464261 6.03325 0.626491 5.12233 0.976602C4.2114 1.32671 3.3807 1.85747 2.68021 2.53694C1.97972 3.21642 1.42392 4.03057 1.04623 4.93041C0.668545 5.83026 0.476783 6.79721 0.482482 7.77308C0.469915 8.78624 0.673405 9.79045 1.07939 10.7188C1.48538 11.6471 2.08455 12.4783 2.83697 13.1569C2.8967 13.2101 2.94534 13.2746 2.98009 13.3467C3.01483 13.4187 3.03499 13.4969 3.03942 13.5768V14.9115C3.04353 15.0099 3.07151 15.1058 3.12093 15.191C3.17035 15.2762 3.23975 15.3481 3.32313 15.4005C3.40651 15.4528 3.50139 15.4842 3.59957 15.4917C3.69776 15.4993 3.79631 15.4829 3.88674 15.4439L5.38641 14.7916C5.51447 14.7432 5.65577 14.7432 5.78382 14.7916C6.49275 14.9829 7.22406 15.0787 7.95835 15.0765C9.89136 15.0795 11.7464 14.3144 13.1153 12.9497C14.4843 11.585 15.255 9.73233 15.258 7.79933C15.261 5.86632 14.496 4.0113 13.1312 2.64235C11.7665 1.2734 9.91385 0.502656 7.98084 0.499673ZM12.4799 6.09345L10.2828 9.58769C10.2 9.71924 10.0907 9.83219 9.96203 9.9194C9.83332 10.0066 9.68792 10.0662 9.53502 10.0944C9.38212 10.1226 9.22504 10.1187 9.07369 10.0832C8.92234 10.0476 8.78002 9.98099 8.6557 9.88762L6.90108 8.57541C6.8232 8.517 6.72848 8.48543 6.63114 8.48543C6.53379 8.48543 6.43907 8.517 6.3612 8.57541L3.99172 10.375C3.92572 10.4259 3.84383 10.4518 3.76058 10.448C3.67733 10.4442 3.59811 10.4111 3.53698 10.3545C3.47584 10.2978 3.43676 10.2214 3.42666 10.1386C3.41657 10.0559 3.43611 9.9723 3.48183 9.90262L5.67885 6.40838C5.76171 6.27683 5.87094 6.16388 5.99966 6.07667C6.12837 5.98946 6.27376 5.92988 6.42666 5.9017C6.57956 5.87351 6.73665 5.87733 6.888 5.91292C7.03934 5.9485 7.18167 6.01508 7.30599 6.10845L9.06061 7.42066C9.13848 7.47907 9.2332 7.51064 9.33055 7.51064C9.42789 7.51064 9.52261 7.47907 9.60049 7.42066L11.97 5.62105C12.036 5.57016 12.1179 5.5443 12.2011 5.54806C12.2844 5.55182 12.3636 5.58496 12.4247 5.6416C12.4858 5.69824 12.5249 5.77471 12.535 5.85743C12.5451 5.94015 12.5256 6.02377 12.4799 6.09345Z" />
  </svg>
);

const whatsappLogo = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="social-icon"
  >
    <path d="M14.0374 10.7835C13.8151 10.6719 12.7189 10.1319 12.5146 10.0581C12.3103 9.98338 12.1618 9.94648 12.0133 10.1697C11.8648 10.392 11.4373 10.8951 11.3068 11.0436C11.1772 11.1921 11.0467 11.2101 10.8244 11.0985C10.1674 10.8369 9.56105 10.4629 9.03247 9.99328C8.54496 9.54266 8.127 9.02219 7.79227 8.44888C7.66267 8.22568 7.77877 8.10508 7.89037 7.99438C7.99027 7.89448 8.11357 7.73428 8.22427 7.60378C8.31595 7.49112 8.39111 7.36596 8.44747 7.23208C8.47712 7.17056 8.49093 7.1026 8.48763 7.03438C8.48433 6.96616 8.46402 6.89985 8.42857 6.84148C8.37277 6.72988 7.92727 5.63278 7.74187 5.18638C7.56097 4.75258 7.37737 4.81108 7.23967 4.80388C7.11007 4.79758 6.96157 4.79578 6.81307 4.79578C6.7001 4.79893 6.58901 4.82542 6.48679 4.87359C6.38456 4.92176 6.29341 4.99057 6.21907 5.07568C5.96709 5.3143 5.76757 5.60279 5.63323 5.92277C5.49888 6.24275 5.43266 6.5872 5.43877 6.93418C5.51103 7.77499 5.82728 8.5764 6.34867 9.23998C7.30439 10.6728 8.61633 11.8325 10.1557 12.6051C10.5709 12.7835 10.9951 12.9403 11.4265 13.0749C11.8813 13.213 12.3621 13.2429 12.8305 13.1622C13.1407 13.0993 13.4345 12.9728 13.6934 12.7906C13.9522 12.6085 14.1705 12.3746 14.3344 12.1038C14.4806 11.7707 14.5256 11.402 14.464 11.0436C14.4091 10.95 14.2606 10.8951 14.0374 10.7835ZM16.2802 2.61238C14.7501 1.08269 12.7163 0.161144 10.5574 0.0193C8.39852 -0.122544 6.26164 0.524982 4.5446 1.84133C2.82756 3.15767 1.64739 5.05313 1.22379 7.17481C0.800189 9.29649 1.16204 11.4998 2.24196 13.3746L0.976562 17.9961L5.70517 16.7568C7.01301 17.4689 8.47841 17.8421 9.96757 17.8422H9.97117C11.7353 17.8413 13.4595 17.3175 14.926 16.3371C16.3926 15.3567 17.5357 13.9636 18.2108 12.3338C18.8859 10.704 19.0629 8.9107 18.7192 7.1804C18.3756 5.45011 17.5268 3.86049 16.2802 2.61237V2.61238ZM13.9105 15.2025C12.7298 15.9425 11.3646 16.3352 9.97117 16.3356H9.96757C8.63998 16.3355 7.33685 15.9783 6.19477 15.3015L5.92387 15.1413L3.11766 15.8775L3.86646 13.1415L3.69096 12.8607C2.91205 11.6185 2.51897 10.1733 2.56141 8.70777C2.60385 7.24222 3.07991 5.82217 3.92939 4.62718C4.77888 3.43219 5.96363 2.51594 7.33385 1.99427C8.70406 1.4726 10.1982 1.36896 11.6273 1.69644C13.0564 2.02392 14.3563 2.76783 15.3627 3.83408C16.369 4.90033 17.0366 6.24105 17.281 7.6867C17.5254 9.13235 17.3356 10.618 16.7356 11.9558C16.1357 13.2936 15.1525 14.4234 13.9105 15.2025Z" />
  </svg>
);

const twitterLogo = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="social-icon"
  >
    <path d="M15.4904 2.34905C14.9268 2.59357 14.3307 2.75521 13.7208 2.82894C14.3643 2.44452 14.8465 1.83975 15.078 1.12682C14.4733 1.48678 13.8113 1.7404 13.1209 1.87665C12.6594 1.37619 12.0449 1.04306 11.3736 0.929497C10.7024 0.815938 10.0125 0.928377 9.41205 1.24918C8.81161 1.56998 8.33464 2.081 8.05593 2.7021C7.77722 3.32319 7.71254 4.01923 7.87204 4.68104C6.64938 4.6192 5.4534 4.30084 4.3618 3.74664C3.2702 3.19244 2.30739 2.4148 1.53592 1.46424C1.26534 1.93676 1.12315 2.47189 1.12351 3.0164C1.12256 3.52208 1.24665 4.02015 1.48475 4.46626C1.72285 4.91237 2.06757 5.29269 2.48822 5.57334C1.99931 5.56004 1.52084 5.42885 1.09352 5.19093V5.22842C1.09719 5.93693 1.34546 6.62243 1.79635 7.16897C2.24725 7.71551 2.87307 8.08953 3.56798 8.22776C3.30048 8.30917 3.02276 8.35209 2.74316 8.35524C2.54962 8.35298 2.35656 8.33542 2.16579 8.30275C2.36368 8.91222 2.74663 9.44486 3.26135 9.82653C3.77608 10.2082 4.39698 10.4199 5.03766 10.4323C3.9558 11.2835 2.6201 11.7481 1.24349 11.752C0.992845 11.7528 0.7424 11.7378 0.493652 11.707C1.89917 12.6145 3.5371 13.0962 5.21012 13.0942C6.36464 13.1062 7.50997 12.888 8.57922 12.4524C9.64847 12.0168 10.6202 11.3725 11.4377 10.5571C12.2551 9.74177 12.9019 8.77169 13.3403 7.70356C13.7786 6.63543 13.9997 5.49066 13.9907 4.33611C13.9907 4.20864 13.9907 4.07367 13.9907 3.9387C14.5791 3.4999 15.0866 2.96198 15.4904 2.34905Z" />
  </svg>
);
const linkedinLogo = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="social-icon"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.0303 0.925903C1.09237 0.925903 0.332031 1.68624 0.332031 2.62417V23.1535C0.332031 24.0914 1.09237 24.8518 2.0303 24.8518H22.5597C23.4976 24.8518 24.258 24.0914 24.258 23.1535V2.62417C24.258 1.68624 23.4976 0.925903 22.5597 0.925903H2.0303ZM5.7023 8.35611C6.84861 8.35611 7.77787 7.42685 7.77787 6.28054C7.77787 5.13424 6.84861 4.20497 5.7023 4.20497C4.556 4.20497 3.62673 5.13424 3.62673 6.28054C3.62673 7.42685 4.556 8.35611 5.7023 8.35611ZM9.67874 9.89001H13.1186V11.4658C13.1186 11.4658 14.0521 9.59892 16.5919 9.59892C18.8575 9.59892 20.7343 10.715 20.7343 14.117V21.2907H17.1696V14.9863C17.1696 12.9794 16.0982 12.7587 15.2818 12.7587C13.5875 12.7587 13.2974 14.2202 13.2974 15.248V21.2907H9.67874V9.89001ZM7.51163 9.89003H3.89298V21.2908H7.51163V9.89003Z"
    />
  </svg>
);
const copy = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z"
      stroke="white"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33325 9.99998H2.66659C2.31296 9.99998 1.97382 9.8595 1.72378 9.60946C1.47373 9.35941 1.33325 9.02027 1.33325 8.66665V2.66665C1.33325 2.31302 1.47373 1.97389 1.72378 1.72384C1.97382 1.47379 2.31296 1.33331 2.66659 1.33331H8.66659C9.02021 1.33331 9.35935 1.47379 9.60939 1.72384C9.85944 1.97389 9.99992 2.31302 9.99992 2.66665V3.33331"
      stroke="white"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const socialHandles = [
  { name: "Facebook", image: facebookLogo },
  { name: "Twitter", image: twitterLogo },
  { name: "LinkedIn", image: linkedinLogo },
  { name: "Messenger", image: messengerLogo },
  { name: "WhatsApp", image: whatsappLogo },
];

const REFERRAL_LINK_HEADER = "https://app.opentabs.org/r/";
const EventPropertyInviteSentPersonalCounterFacebook =
  "PersonalCounter_Facebook";
const EventPropertyInviteSentPersonalCounterTwitter = "PersonalCounter_Twitter";
const EventPropertyInviteSentPersonalCounterLinkedIn =
  "PersonalCounter_LinkedIn";
const EventPropertyInviteSentPersonalCounterMessenger =
  "PersonalCounter_Messenger";
const EventPropertyInviteSentPersonalCounterWhatsApp =
  "PersonalCounter_WhatsApp";
const EventPropertyInviteSentUniversalCounterFacebook =
  "UniversalCounter_Facebook";
const EventPropertyInviteSentUniversalCounterTwitter =
  "UniversalCounter_Twitter";
const EventPropertyInviteSentUniversalCounterLinkedIn =
  "UniversalCounter_LinkedIn";
const EventPropertyInviteSentUniversalCounterMessenger =
  "UniversalCounter_Messenger";
const EventPropertyInviteSentUniversalCounterWhatsApp =
  "UniversalCounter_WhatsApp";

const COMMUNITY_DISCORD_LINK = "https://discord.com/invite/RWh4C6wZDh";
const STORAGE_CUMMULATIVE_TABS_OPENED = "cummulativeTabsOpened";
const GLOBAL_TREES_SAVED_TILL_CHANGED_DATE = 8_212_000;
const CHROME = "chrome";
const SAVING_TREES_RATE_CHANGED_DATE = new Date(2022, 4, 3, 0, 0, 0);
const CO2_STORED_PER_TREE = 0.11;
const STORAGE_RECENT_DAY_TABS_OPENED = "lastTabDay.count";
const STORAGE_TREES_SAVED = "treesSaved";
const SUB_DOMAIN = "http://localhost:5001";
//const SUB_DOMAIN = "https://app.opentabs.org";

const Counter = ({ togglePopup, header, popup }) => {
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);

  const handleClick = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  const handleClose = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      <div className="app-dash metric-item" onClick={handleClick}>
        {header}
      </div>
      {isPopupVisible && (
        <>
          <div className="app-wrapper nipple nipple-top-right">{popup}</div>
          <div className="popup-overlay" onClick={handleClose}></div>
        </>
      )}
    </>
  );
};

const counterAppreciationMessage = (type, handleSignin, loggedIn) =>
  type === "global" ? (
    <>
      This is the power of the many!{" "}
      <a
        href={COMMUNITY_DISCORD_LINK}
        target="_blank"
        className="counterAppreciationMessage"
        rel="noopener noreferrer"
      >
        Join
      </a>{" "}
      our discord to engage with our community.
    </>
  ) : (
    <>
      {loggedIn ? (
        <>
          Your tabs make a difference Thank you for opening tabs with purpose.
        </>
      ) : (
        <>
          Small actions add up.{" "}
          <span className="counterAppreciationMessage" onClick={handleSignin}>
            Sign in
          </span>{" "}
          to keep track of your impact across devices
        </>
      )}
    </>
  );

const Heading = ({ type, handleSignin, loggedIn }) => (
  <div className="pb-6">
    <p className="text popup-text-colour">
      {counterAppreciationMessage(type, handleSignin, loggedIn)}
    </p>
  </div>
);

const Statistic = ({ title, image, value }) => {
  return (
    <div className="pt-14">
      <div className="flex-container">
        {image}
        <p className="numbers-heading">{value ? addCommas(value) : value}</p>
      </div>
      <div>
        <p className="text counter-popup-text">{title}</p>
      </div>
      <hr className="grey-horizontal" />
    </div>
  );
};

const Statistics = ({ dataList }) =>
  dataList.map((element, index) => {
    if (
      element.title === "Tons of CO2 eq. you have stored" &&
      element.value === String(0)
    )
      return null;
    return (
      <Statistic
        title={element.title}
        image={element.image}
        value={element.value}
        key={index}
      />
    );
  });

const ShareYourImpact = ({ type }) => (
  <div className="flex-container-space mt-16">
    <p className="text-small primary-text-colour fw-600">Share your impact</p>
    <ShareOnSocial type={type} />
  </div>
);

// TODO: Set dispatch for trees saved, current badge

const getIndividualPropertyName = (socialHandle) => {
  switch (socialHandle) {
    case "Facebook":
      return EventPropertyInviteSentPersonalCounterFacebook;
    case "Twitter":
      return EventPropertyInviteSentPersonalCounterTwitter;
    case "LinkedIn":
      return EventPropertyInviteSentPersonalCounterLinkedIn;
    case "Messenger":
      return EventPropertyInviteSentPersonalCounterMessenger;
    case "WhatsApp":
      return EventPropertyInviteSentPersonalCounterWhatsApp;
  }
};

const getGlobalPropertyName = (socialHandle) => {
  switch (socialHandle) {
    case "Facebook":
      return EventPropertyInviteSentUniversalCounterFacebook;
    case "Twitter":
      return EventPropertyInviteSentUniversalCounterTwitter;
    case "LinkedIn":
      return EventPropertyInviteSentUniversalCounterLinkedIn;
    case "Messenger":
      return EventPropertyInviteSentUniversalCounterMessenger;
    case "WhatsApp":
      return EventPropertyInviteSentUniversalCounterWhatsApp;
  }
};

const ShareOnSocial = ({
  link: badgeLink,
  type,
  badgeName,
  numberOfTreesSaved,
  showCopyButton,
  eventProperty,
}) => {
  const id = "12345",
    treesSaved = 43428782;
  const formattedTreesSaved = addCommas(NumberFloor(treesSaved));

  let INVITE_MESSAGE, TWITTER_INVITE_MESSAGE, link;

  INVITE_MESSAGE =
    type === "achievement" || type === "achievement_notification"
      ? `I've achieved the ${badgeName} Badge for saving ${numberOfTreesSaved} trees with OpenTabs, a browser extension that saves a tree for every 10 tabs you open. It's an easy (and free) way to help the environment! 🌳✨`
      : `Hi there 😊 I've saved ${formattedTreesSaved} trees with OpenTabs, and I think you should too! It's a browser extension that saves a tree for every 10 tabs you open, so it's an easy (and free) way to help the environment. Give it a try, they're currently saving 10 trees for every new person that joins: `;
  TWITTER_INVITE_MESSAGE =
    type === "achievement" || type === "achievement_notification"
      ? INVITE_MESSAGE
      : `I've saved ${formattedTreesSaved} trees with OpenTabs! It's a browser extension that saves a tree for every 10 tabs you open, so it's an easy (and free) way to help the environment. Give it a try, they're currently saving 10 trees for every new person that joins:`;
  link =
    type === "achievement" || type === "achievement_notification"
      ? badgeLink
      : `${REFERRAL_LINK_HEADER}${id}/`;

  const buttonRef = React.useRef(null);
  const copyButtonClickHandler = () => {
    copyValueToClipboard(link);
    buttonRef.current.querySelector("span").innerText = "Copied";
  };

  const getSharingLink = (socialHandle) => {
    switch (socialHandle) {
      case "Facebook": {
        return `https://www.facebook.com/sharer.php?u=${link}`;
      }
      case "Twitter": {
        return `http://twitter.com/share?text=${TWITTER_INVITE_MESSAGE}&url=${link}`;
      }
      case "LinkedIn": {
        return `https://www.linkedin.com/sharing/share-offsite/?url=${link}`;
      }
      case "Messenger": {
        return `https://www.messenger.com/t/`;
      }
      case "WhatsApp": {
        return `https://web.whatsapp.com/send?text=${INVITE_MESSAGE} ${link}`;
      }
      default: {
        return link;
      }
    }
  };

  const socialInviteHandler = (socialHandle) => {
    const eventProperty = ((type) => {
      switch (type) {
        case "individual":
          return getIndividualPropertyName(socialHandle);
        case "global":
          return getGlobalPropertyName(socialHandle);
      }
    })(type);
  };

  return (
    <>
      {socialHandles.map((element, index) => (
        <a
          href={getSharingLink(element.name)}
          target="_blank"
          rel="noopener noreferrer"
          key={index}
          onClick={() => socialInviteHandler(element.name)}
        >
          <span key={index}>{element.image}</span>
        </a>
      ))}
      {showCopyButton === true && (
        <button
          className="button small-button button-primary image-button"
          onClick={copyButtonClickHandler}
          ref={buttonRef}
        >
          {copy}
          <span>Copy</span>
        </button>
      )}
    </>
  );
};

const CounterPopup = (props) => {
  const loggedIn = false;

  const handleSignin = () => {};

  return (
    <div className="app counter-popup">
      <Heading
        type={props.type}
        handleSignin={handleSignin}
        loggedIn={loggedIn}
      />
      <Statistics dataList={props.dataList} />
      <ShareYourImpact type={props.type} />
    </div>
  );
};

const GlobalCounter = () => {
  const globalCounterRef = React.useRef(null);

  const [treesSaved, setTreesSaved] = React.useState(getTotalTreesSaved());
  const [tabsOpened, setTabsOpened] = React.useState(
    Math.ceil(Date.now() / 1000000)
  );
  const secondsPerTabOpened =
    getLocalStorage(STORAGE_SECONDS_PER_TAB_OPENED) ||
    DEFAULT_SECONDS_PER_TAB_OPENED;

  React.useEffect(() => {
    const treeIncrementInterval = setInterval(() => {
      setTreesSaved((prevValue) => prevValue + 1);
    }, DEFAULT_SECONDS_PER_TREE_SAVED * 1000);
    return () => {
      clearInterval(treeIncrementInterval);
    };
  }, []);

  React.useEffect(() => {
    const tabIncrementInterval = setInterval(() => {
      setTabsOpened((prevValue) => prevValue + 1);
    }, secondsPerTabOpened * 1000);
    return () => {
      clearInterval(tabIncrementInterval);
    };
  }, []);

  const counterDataList = [
    { title: "Trees we have saved", image: colourLogo, value: treesSaved },
    {
      title: "Tons of CO2 eq. we have stored",
      image: cloud,
      value: addCommas(treesToCO2Stored(treesSaved)),
    },
  ];

  const CounterHeader = () => (
    <>
      <span>{addCommas(treesSaved)}</span> {globe}
    </>
  );

  return (
    <div className="app-container counter" ref={globalCounterRef}>
      <Counter
        togglePopup={() => {}}
        header={<CounterHeader />}
        popup={<CounterPopup dataList={counterDataList} type="global" />}
      />
    </div>
  );
};

function Counters() {
  return (
    <div className="region top-right">
      <IndividualCounter />
      <GlobalCounter />
    </div>
  );
}

const RADIUS = 15.3843;

const CounterHeader = ({ counter, logo }) => (
  <>
    <span>{counter ? addCommas(counter) : counter}</span>
    {logo}
  </>
);

const IndividualCounter = () => {
  const individualCounterRef = React.useRef(null);
  const [user, setUser] = React.useState({});

  let userTreesSaved,
    userTabsOpened = 0;

  const localTreesSaved = localStorage.getItem(STORAGE_TREES_SAVED) || 53.6;
  let tabsOpened = 0;

  if (!!localTreesSaved || localTreesSaved === 0)
    userTreesSaved = NumberFloor(localTreesSaved);
  if (!!tabsOpened) userTabsOpened = NumberFloor(tabsOpened);

  const onWidgetClick = () => {};

  const logo = (
    <svg
      width="35"
      height="34"
      viewBox="0 0 35 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="progress-circle-logo"
    >
      <circle
        cx="17.8994"
        cy="16.9298"
        r={RADIUS}
        stroke="#E9E9E9"
        strokeOpacity="0.8"
        strokeWidth="3.09091"
        className="progress-circle-bg"
      />
      <circle
        cx="17.8994"
        cy="16.9298"
        r={RADIUS}
        strokeWidth="3.09091"
        // style={{ strokeDashoffset: dashOffset }}
        transform="rotate(-90 18 17)"
        className="progress-circle"
      />
      <path d="M28.014 17.3449C25.2524 17.7681 23.1672 19.1789 21.6737 21.5207C21.5046 21.7746 21.5891 21.9157 21.8709 21.9721C22.2936 22.0285 22.6881 22.0568 23.1108 22.1132C25.6469 22.085 27.9012 20.2792 28.493 17.8245C28.5775 17.3731 28.493 17.2603 28.014 17.3449Z" />
      <path d="M24.407 17.0628C24.5761 16.9781 24.717 16.6678 24.717 16.4703C24.717 15.1442 24.4352 13.8745 23.8716 12.6331C23.7025 12.2663 23.4489 12.2381 23.1671 12.4638C22.7444 12.7741 22.3218 13.0563 21.9554 13.4231C20.2083 15.0595 19.5039 18.0221 20.7719 20.1382C21.1382 19.9971 21.4482 19.461 21.73 19.1507C22.519 18.3324 23.3644 17.6271 24.407 17.0628Z" />
      <path d="M19.2498 19.8559C18.8835 19.0941 18.7144 18.2195 18.7144 17.373C18.7144 16.3009 18.9962 15.2852 19.5035 14.4387C19.7852 13.9591 20.1234 13.5076 20.5461 13.1408C20.7997 12.8023 20.8279 12.4637 20.6588 12.0687C20.1798 10.9683 19.588 9.95256 18.7708 9.07791C18.3199 8.62647 18.2636 8.62647 17.9818 9.19077C16.5728 12.1533 16.3192 15.1441 17.1928 18.1631C17.2491 18.3323 17.2773 18.5016 17.3337 18.6427C17.4182 18.8684 17.4746 19.0659 17.5591 19.2917C17.6436 19.5456 17.7 19.8277 17.7845 20.0817C19.2498 24.455 17.221 27.9536 16.0093 30.2108C15.8684 30.4929 15.5584 30.8597 16.2065 30.8879C17.221 30.9161 18.2636 30.9161 19.278 30.8879C19.4189 30.8879 19.6162 30.634 19.7007 30.5211C20.5461 29.1386 21.5887 25.5553 20.7433 23.3546C20.2643 22.1131 19.8134 21.041 19.2498 19.8559Z" />
      <path d="M15.6995 17.9656C15.8122 17.9938 16.0095 18.022 16.0658 17.9374C16.1222 17.8527 16.1222 17.6834 16.0658 17.5706C15.5868 16.2163 15.3895 14.8055 15.5304 13.3666C15.5586 13.1691 15.3895 12.8869 15.2204 12.7741C14.3187 12.1251 13.3324 11.7301 12.2616 11.5044C11.9235 11.4198 11.7544 11.5326 11.7262 11.8712C11.6135 13.3384 11.7262 14.608 12.5998 15.8213C13.3606 16.8652 14.4596 17.627 15.6995 17.9656Z" />
      <path d="M17.1655 22.5082C17.2782 22.2825 17.25 22.0568 17.2218 21.8028C17.1373 21.041 16.8273 20.251 16.2638 19.7432C14.9393 18.5581 12.9668 18.9249 12.0087 17.1474C11.7833 16.7524 11.6424 16.2727 11.2479 16.047C11.0506 15.9342 10.8252 15.8777 10.5998 15.8495C9.52897 15.7085 8.42999 15.7649 7.38736 15.9906C6.99286 16.0752 6.85196 16.2445 7.02104 16.696C7.72551 18.7274 9.19082 20.4767 11.0506 21.5489C12.0087 22.085 13.0232 22.48 14.1222 22.6775C14.6576 22.7339 16.8837 23.1289 17.1655 22.5082Z" />
    </svg>
  );

  const counterDataList = [
    {
      title: "Trees you have saved",
      image: colourLogo,
      value: addCommas(user?.treesSaved ? Math.floor(user?.treesSaved) : 0),
    },
    {
      title: "Searches you have made",
      image: tab,
      value: addCommas(user?.searchCount ? user?.searchCount : 0),
    },
    {
      title: "Tons of CO2 eq. you have stored",
      image: cloud,
      value: addCommas(
        treesToCO2Stored(user?.treesSaved ? user?.treesSaved : 0)
      ),
    },
  ];

  React.useEffect(() => {
    getPersonalCounters("6297729f8a348b035eea1ee1");
  }, []);

  const getPersonalCounters = async (userId) => {
    try {
      const response = await fetch(
        `${SUB_DOMAIN}/api/users/updateUserInfo`,
        getPostHeader({ userId, update: true })
      );

      const user = await response.json();
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-container counter" ref={individualCounterRef}>
      <Counter
        togglePopup={onWidgetClick}
        header={
          <CounterHeader
            counter={addCommas(
              user?.treesSaved ? Math.floor(user?.treesSaved) : 0
            )}
            logo={logo}
          />
        }
        popup={<CounterPopup dataList={counterDataList} type="individual" />}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Counters />);
