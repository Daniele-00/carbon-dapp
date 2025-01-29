
//Per risolvere l'errore TypeScript con window.ethereum, 
// dobbiamo dichiarare il tipo
export {};

declare global {
  interface Window {
    ethereum?: any;
  }
}