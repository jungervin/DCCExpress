import { CustomCanvas, drawModes } from "./editor";
import { TurnoutRightElement } from "./turnout";
import { RailView } from "./view";
import * as bootstrap from "bootstrap";
// Toolbar.ts
export class Toolbar extends HTMLElement {
    canvas: CustomCanvas | undefined;
    currentModal: HTMLElement | undefined;
    turnoutModal: bootstrap.Modal;
    turnoutAddress: HTMLInputElement;
    turnoutInverted: HTMLInputElement;
    btnPointer: any;
    btnTurnout: any;
    btnLine: any;
    btnRemove: any;
    btnRect: any;
    toolbarExt: HTMLSpanElement;
    btnShapes: any;
    // btnRotateLeft: any;
    btnRotateRight: any;
    btnProperties: HTMLElement;
//    btnOpen: any;
    btnSave: any;
//    btnCopy: any;
    btnEdit: any;
    toolbarEdit: any;
    toolbarPlay: any;
    btnFitToPage: any;
    btnUndo: any;
    btnRedo: any;
    btnAppSettings: any;
    btnLoco: any;
    btnPower: HTMLElement | null;
    btnEmergencyStop: HTMLElement | null;
    wsStatus: HTMLElement | null;
    // btnMoveDown: any;
    // btnMoveUp: any;
    btnMoveToBottom: any;
    btnMoveToTop: any;
    btnDispatcher: any;
    btnCodeEditor: any;
    btnTasks: any;
    btnCommandCenterSettings: HTMLElement | null;
    btnDebug: HTMLElement;
    btnConsole: HTMLElement;
    btnProgrammer: HTMLElement;


    constructor() {
        super();

        // A gombok és a stílusok hozzáadása
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                .toolbar {
                    display: flex;
                    padding: 4px;
                    margin: 0px;
                    background-color: #f0f0f0;
                    height: 32px;
                    gap: 4px;
                    align-items: center;
                    position: relative;
                }
                #toolbarPlay {
                    display: none;
                    margin-top: 8px;
                }
                #toolbarEdit{
                    float: left;
                    padding: 0px;
                    margin: 0px;
                    margin-top: 8px;
                    
                }
                button:hover {
                    background-color: #e0e0e0;
                }
                .toolbarButton {
                    width: 24px;
                    height: 24px;
                    padding: 4px;
                    cursor: pointer;
                    border-radius: 5px;
                    border: solid 1px rgb(168, 168, 168);
                    background-color: white;
                }
                .toolbarButton:hover {
                    background-color: #e0e0e0;
                }
                .toolbarButton.active {
                    background-color: silver;
                }
                .toolbarButton:active {
                    background-color: gray;
                }

                .toolbarButton.error {
                    background-color: red;
                    fill: yellow;
                    animation: blink 0.5s infinite alternate;
                }
                @keyframes blink {
                    from {
                        background-color: red;
                        fill: yellow;
                    }
                    to {
                        background-color: transparent;
                        fill: #000;
                    }
                }                    
                .toolbarButton.success {
                    background-color: rgb(0, 255, 0);
                    fill: black;
                }

                .toolbarButton.disabled {
                    fill: silver
                }
                .separator {
                    width: 24px;
                    height: 24px;
                    padding-bottom: 4px;
                    margin: 0px;
                }
                div {
                    margin:0;
                }
                .wsStatus {
                    position: absolute;
                    right: 0;
                    top:0;
                    margin: 0;
                    padding-top: 2px;
                }
            </style>
            <div class="toolbar">
               
                <svg id="btnLoco" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Train</title><path d="M12,2C8,2 4,2.5 4,6V15.5A3.5,3.5 0 0,0 7.5,19L6,20.5V21H8.23L10.23,19H14L16,21H18V20.5L16.5,19A3.5,3.5 0 0,0 20,15.5V6C20,2.5 16.42,2 12,2M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M11,10H6V6H11V10M13,10V6H18V10H13M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17Z" /></svg>
                <svg id="btnDispatcher" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 451.68"><title>Dispatcher</title><path d="m269.13 380.42 7.07 44.83 37.72-91.14-49.96 14.51 18.49 18.49-13.32 13.31zm-31.92 42.31 7.15-41.81-13.77-13.81 17.57-17.62-47.64-14.76 36.69 88zm-86.43-273.1c15.59-9.22 43.71-15.3 75.01-17.66 6.7 11.66 16.58 19.35 28.91 23.86 12.53-4.71 22.41-12.57 29.07-23.86 29.15 2.23 56.16 7.94 73.65 17.66h2.61c3.92 0 2.64 20.55 3.14 25.97 3.6.99 6.2 3.39 7.98 6.62 5.54 10 1.82 27.54-2.11 37.5l-.04.13c-2.32 5.91-5.42 11.29-9.02 15.26-3.01 3.22-6.41 5.54-10.09 6.45-.7 2.27-1.49 4.63-2.06 6.95-4.1 13.81-7.32 24.68-15.84 35.48a84.995 84.995 0 0 1-5.96 6.78 69.96 69.96 0 0 1-4.46 4.34c.37 3.97.12 20.1.12 25.27 2.03-.99 4.42-1.2 6.7-.29C430.04 361.11 511.92 366.03 512 451.68H0c3.76-97.14 88.17-94 180.14-129.36 1.78-.66 5.17-2.36 6.99-2.64v-24.44c0-.91.24-1.78.62-2.53-.87-.78-1.7-1.61-2.48-2.4-7.24-7.44-12.29-14.47-16.71-24.31-3.02-6.7-5.42-13.94-8.19-22.13l-1.45-4.26c-3.14-.41-6.08-1.86-8.72-4.01-3.31-2.73-6.16-6.7-8.48-11.29-5.54-10.91-12.61-39.08.99-47.59 1.08-.71 2.28-1.2 3.6-1.53.83-8.19-2.4-25.81 4.47-25.56zM310.48 304c-10.87 6.83-21.58 11.79-34.32 14.68-23.94 5.59-46.23.5-67.61-10.58-3.39-1.78-6.78-3.73-10.22-5.92v20.31l56.12 17.37 56.03-16.26V304zM145.85 133.83v-21.96l-17.74-13.6c-25.43-28.21-20.3-27.38 6.66-34.95C174.14 52.24 200.85 28.3 224.05 13c26.31-17.33 34.45-17.33 60.75 0 23.16 15.3 49.92 39.24 89.24 50.32 26.97 7.57 32.09 6.74 6.7 34.95L363 111.87v21.96c-24.07-9.1-48.26-15.13-72.45-18.15 2.52-9.43 3.6-14.27 2.98-26.88-11.29 1.03-24.44-3.31-38.96-12.53-12.57 9.76-25.55 12.61-38.79 11.95-.37 12.94.83 17.91 3.35 27.33-24.48 2.98-48.96 9.06-73.28 18.28zm25.35 37.3-3.39 20.02c-.33 1.98-2.69 3.02-4.26 1.9l-6.28-4.01c-2.36-1.53-6.04-4.72-8.36-.99-4.13 6.7.79 24.07 4.02 30.6 1.57 3.1 3.35 5.66 5.21 7.19 3.39 2.69 4.5-.33 8.14 1.62 3.11 1.69 3.81 5.87 4.88 8.97l1.29 3.8c2.48 7.45 4.75 14.07 7.4 20.06 5.5 12.28 12.86 21.05 23.49 29.16 11.33 8.6 24.06 14.47 38.04 17.12 10.26 1.9 20.76 1.9 31.02-.17a85.537 85.537 0 0 0 36.31-16.87c4.92-3.89 9.42-8.31 13.39-13.36 3.48-4.34 5.96-8.97 7.99-14.06 2.1-5.21 3.8-10.83 5.66-17.16 1.08-3.64 2.15-7.28 3.31-10.92 1.78-6.9 7.15-2.27 11.83-7.4 2.35-2.69 4.59-6.82 6.41-11.45 1.49-3.85 7.94-26.8.82-29.16-1.9-.83-4.79 1.53-6.28 2.56-3.44 2.28-5.05 3.35-10.47 4.97-3.51.99-3.63-2.77-3.8-5.01l-1.7-18.9c-49.91 21.71-121.49 21.09-164.67 1.49z"/></svg>
                <svg id="btnTasks" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Tasks</title><path d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z" /></svg>
                <svg id="btnEdit" class="toolbarButton"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Edit</title><path d="M5,5H7V7H5V5M1,1H11V11H1V1M3,3V9H9V3H3M5,17H7V19H5V17M1,13H11V23H1V13M3,15V21H9V15H3M13,13H17V15H19V13H23V15H19V17H23V23H19V21H15V23H13V21H15V19H13V13M21,21V19H19V21H21M19,17H17V15H15V19H19V17M22.7,3.35L21.7,4.35L19.65,2.35L20.65,1.35C20.85,1.14 21.19,1.13 21.42,1.35L22.7,2.58C22.91,2.78 22.92,3.12 22.7,3.35M13,8.94L19.07,2.88L21.12,4.93L15.06,11H13V8.94Z" /></svg>
                <div id="toolbarEdit" style="display: none">
                    <svg id="btnSave" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Save</title><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" /></svg>
                    <svg id="btnAppSettings" class="toolbarButton"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Settings...</title><path d="M21.7 18.6V17.6L22.8 16.8C22.9 16.7 23 16.6 22.9 16.5L21.9 14.8C21.9 14.7 21.7 14.7 21.6 14.7L20.4 15.2C20.1 15 19.8 14.8 19.5 14.7L19.3 13.4C19.3 13.3 19.2 13.2 19.1 13.2H17.1C16.9 13.2 16.8 13.3 16.8 13.4L16.6 14.7C16.3 14.9 16.1 15 15.8 15.2L14.6 14.7C14.5 14.7 14.4 14.7 14.3 14.8L13.3 16.5C13.3 16.6 13.3 16.7 13.4 16.8L14.5 17.6V18.6L13.4 19.4C13.3 19.5 13.2 19.6 13.3 19.7L14.3 21.4C14.4 21.5 14.5 21.5 14.6 21.5L15.8 21C16 21.2 16.3 21.4 16.6 21.5L16.8 22.8C16.9 22.9 17 23 17.1 23H19.1C19.2 23 19.3 22.9 19.3 22.8L19.5 21.5C19.8 21.3 20 21.2 20.3 21L21.5 21.4C21.6 21.4 21.7 21.4 21.8 21.3L22.8 19.6C22.9 19.5 22.9 19.4 22.8 19.4L21.7 18.6M18 19.5C17.2 19.5 16.5 18.8 16.5 18S17.2 16.5 18 16.5 19.5 17.2 19.5 18 18.8 19.5 18 19.5M12.3 22H3C1.9 22 1 21.1 1 20V4C1 2.9 1.9 2 3 2H21C22.1 2 23 2.9 23 4V13.1C22.4 12.5 21.7 12 21 11.7V6H3V20H11.3C11.5 20.7 11.8 21.4 12.3 22Z" /></svg>
                    <svg id="btnCommandCenterSettings" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Command Center Settings</title><path d="M20.2,4.9C19,3.8 17.5,3.2 16,3.2C14.5,3.2 13,3.8 11.8,4.9L11,4.1C12.4,2.7 14.2,2 16,2C17.8,2 19.6,2.7 21,4.1L20.2,4.9M19.3,5.7L18.5,6.5C17.8,5.8 16.9,5.5 16,5.5C15.1,5.5 14.2,5.8 13.5,6.5L12.7,5.7C13.6,4.8 14.8,4.3 16,4.3C17.2,4.3 18.4,4.8 19.3,5.7M19,12A2,2 0 0,1 21,14V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V14A2,2 0 0,1 5,12H15V8H17V12H19M8,17V15H6V17H8M11.5,17V15H9.5V17H11.5M15,17V15H13V17H15M7,22H9V24H7V22M11,22H13V24H11V22M15,22H17V24H15V22Z" /></svg>
                    <svg id="btnDebug" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Debug</title><path d="M14,12H10V10H14M14,16H10V14H14M20,8H17.19C16.74,7.22 16.12,6.55 15.37,6.04L17,4.41L15.59,3L13.42,5.17C12.96,5.06 12.5,5 12,5C11.5,5 11.04,5.06 10.59,5.17L8.41,3L7,4.41L8.62,6.04C7.88,6.55 7.26,7.22 6.81,8H4V10H6.09C6.04,10.33 6,10.66 6,11V12H4V14H6V15C6,15.34 6.04,15.67 6.09,16H4V18H6.81C7.85,19.79 9.78,21 12,21C14.22,21 16.15,19.79 17.19,18H20V16H17.91C17.96,15.67 18,15.34 18,15V14H20V12H18V11C18,10.66 17.96,10.33 17.91,10H20V8Z" /></svg>
                    <svg id="btnConsole" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Console</title><path d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z" /></svg>                    
                    <svg id="btnProgrammer" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Programmer</title><path d="M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3H5M5 5H19V19H5V5M15.1 7.88C14.45 7.29 13.83 7 12.3 7H8V17H9.8V13.4H12.3C13.8 13.4 14.46 13.12 15.1 12.58C15.74 12.03 16 11.25 16 10.23C16 9.26 15.75 8.5 15.1 7.88M13.6 11.5C13.28 11.81 12.9 12 12.22 12H9.8V8.4H12.1C12.76 8.4 13.27 8.65 13.6 9C13.93 9.35 14.1 9.72 14.1 10.24C14.1 10.8 13.92 11.19 13.6 11.5Z" /></svg>           
                    <svg class="separator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Train</title><path d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z" /></svg>

                    <svg id="btnPointer" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Pointer (ESC)</title><path d="M13.75,10.19L14.38,10.32L18.55,12.4C19.25,12.63 19.71,13.32 19.65,14.06V14.19L19.65,14.32L18.75,20.44C18.69,20.87 18.5,21.27 18.15,21.55C17.84,21.85 17.43,22 17,22H10.12C9.63,22 9.18,21.82 8.85,21.47L2.86,15.5L3.76,14.5C4,14.25 4.38,14.11 4.74,14.13H5.03L9,15V4.5A2,2 0 0,1 11,2.5A2,2 0 0,1 13,4.5V10.19H13.75Z" /></svg>
                    <svg id="btnShapes" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Shapes...</title><path d="M11 11V2H2V11M4 9V4H9V9M20 6.5C20 7.9 18.9 9 17.5 9S15 7.9 15 6.5 16.11 4 17.5 4 20 5.11 20 6.5M6.5 14L2 22H11M7.58 20H5.42L6.5 18.08M22 6.5C22 4 20 2 17.5 2S13 4 13 6.5 15 11 17.5 11 22 9 22 6.5M19 17V14H17V17H14V19H17V22H19V19H22V17Z" /></svg>
                    <svg id="btnRemove" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Remove</title><path d="M16.24,3.56L21.19,8.5C21.97,9.29 21.97,10.55 21.19,11.34L12,20.53C10.44,22.09 7.91,22.09 6.34,20.53L2.81,17C2.03,16.21 2.03,14.95 2.81,14.16L13.41,3.56C14.2,2.78 15.46,2.78 16.24,3.56M4.22,15.58L7.76,19.11C8.54,19.9 9.8,19.9 10.59,19.11L14.12,15.58L9.17,10.63L4.22,15.58Z" /></svg>
                    
                    <svg id="btnCodeEditor" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Dispatcher code</title><path d="M5 3C3.9 3 3 3.9 3 5S2.1 7 1 7V9C2.1 9 3 9.9 3 11S3.9 13 5 13H7V11H5V10C5 8.9 4.1 8 3 8C4.1 8 5 7.1 5 6V5H7V3M11 3C12.1 3 13 3.9 13 5S13.9 7 15 7V9C13.9 9 13 9.9 13 11S12.1 13 11 13H9V11H11V10C11 8.9 11.9 8 13 8C11.9 8 11 7.1 11 6V5H9V3H11M22 6V18C22 19.11 21.11 20 20 20H4C2.9 20 2 19.11 2 18V15H4V18H20V6H17.03V4H20C21.11 4 22 4.89 22 6Z" /></svg>                    
                    
                    <svg id="btnFitToPage" class="toolbarButton"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Align</title><path d="M20,2H4C2.89,2 2,2.89 2,4V20C2,21.11 2.89,22 4,22H20C21.11,22 22,21.11 22,20V4C22,2.89 21.11,2 20,2M20,20H4V4H20M13,8V10H11V8H9L12,5L15,8M16,15V13H14V11H16V9L19,12M10,13H8V15L5,12L8,9V11H10M15,16L12,19L9,16H11V14H13V16" /></svg>
                   
                    <svg class="separator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z" /></svg>
                    <span id="toolbarExt">
                        <svg id="btnProperties" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Properties</title><path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z" /></svg>                    
                        <svg id="btnRotateRight" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Rotate (R)</title><path d="M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12C4,16.08 7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12C6,9.03 8.16,6.57 11,6.09V10L15.55,5.55Z" /></svg>
                        <svg id="btnMoveToTop" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Move to top</title><path d="M4.08,11.92L12,4L19.92,11.92L18.5,13.33L13,7.83V22H11V7.83L5.5,13.33L4.08,11.92M12,4H22V2H2V4H12Z" /></svg>
                        <svg id="btnMoveToBottom" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Move to bottom</title><path d="M19.92,12.08L12,20L4.08,12.08L5.5,10.67L11,16.17V2H13V16.17L18.5,10.66L19.92,12.08M12,20H2V22H22V20H12Z" /></svg>                        
                    
                    <svg class="separator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z" /></svg>
                        </span>


                </div>

                <div id="toolbarPlay" style="display: none">
                    <svg class="separator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z" /></svg>
                </div>

                <div class="wsStatus">
                    <svg id="btnPower" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Power</title><path d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13" /></svg>
                    <svg id="btnEmergencyStop" class="toolbarButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Emergency Stop</title><path d="M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z" /></svg>                    
                    <svg id="wsStatus" class="toolbarButton" style="cursor: default" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Connection Status</title><path d="M4.93,3.93C3.12,5.74 2,8.24 2,11C2,13.76 3.12,16.26 4.93,18.07L6.34,16.66C4.89,15.22 4,13.22 4,11C4,8.79 4.89,6.78 6.34,5.34L4.93,3.93M19.07,3.93L17.66,5.34C19.11,6.78 20,8.79 20,11C20,13.22 19.11,15.22 17.66,16.66L19.07,18.07C20.88,16.26 22,13.76 22,11C22,8.24 20.88,5.74 19.07,3.93M7.76,6.76C6.67,7.85 6,9.35 6,11C6,12.65 6.67,14.15 7.76,15.24L9.17,13.83C8.45,13.11 8,12.11 8,11C8,9.89 8.45,8.89 9.17,8.17L7.76,6.76M16.24,6.76L14.83,8.17C15.55,8.89 16,9.89 16,11C16,12.11 15.55,13.11 14.83,13.83L16.24,15.24C17.33,14.15 18,12.65 18,11C18,9.35 17.33,7.85 16.24,6.76M12,9A2,2 0 0,0 10,11A2,2 0 0,0 12,13A2,2 0 0,0 14,11A2,2 0 0,0 12,9M11,15V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15A1,1 0 0,0 14,19H13V15H11Z" /></svg>
                </div>
            </div>
        `;

        this.btnDispatcher = this.shadowRoot!.getElementById("btnDispatcher") as any
        this.btnTasks = this.shadowRoot!.getElementById("btnTasks") as any
        this.btnPower = this.shadowRoot!.getElementById("btnPower")
        this.btnEmergencyStop = this.shadowRoot!.getElementById("btnEmergencyStop")
        this.wsStatus = this.shadowRoot!.getElementById("wsStatus")
        this.btnLoco = this.shadowRoot!.getElementById('btnLoco') as any
        this.btnEdit = this.shadowRoot!.getElementById('btnEdit') as any
        this.toolbarEdit = this.shadowRoot!.getElementById('toolbarEdit') as any
        this.toolbarPlay = this.shadowRoot!.getElementById('toolbarPlay') as any
        

        // this.btnOpen = this.shadowRoot!.getElementById('btnOpen') as any
        
        this.btnSave = this.shadowRoot!.getElementById('btnSave') as any
        this.btnAppSettings = this.shadowRoot!.getElementById('btnAppSettings') as any
        this.btnCommandCenterSettings = this.shadowRoot?.getElementById("btnCommandCenterSettings") as any
        this.btnDebug = this.shadowRoot?.getElementById("btnDebug") as HTMLElement
        this.btnConsole = this.shadowRoot?.getElementById("btnConsole") as HTMLElement
        this.btnProgrammer = this.shadowRoot?.getElementById("btnProgrammer") as HTMLElement
        

        this.toolbarExt = this.shadowRoot!.getElementById("toolbarExt") as HTMLSpanElement

        this.btnPointer = this.shadowRoot!.getElementById('btnPointer') as any
        this.btnShapes = this.shadowRoot!.getElementById('btnShapes') as any
        this.btnRemove = this.shadowRoot!.getElementById('btnRemove') as any
        this.btnFitToPage = this.shadowRoot!.getElementById('btnFitToPage') as any
        this.btnCodeEditor = this.shadowRoot!.getElementById('btnCodeEditor') as any


        this.btnProperties =this.shadowRoot!.getElementById('btnProperties') as any
        this.btnRotateRight =this.shadowRoot!.getElementById('btnRotateRight') as any
        this.btnMoveToBottom =this.shadowRoot!.getElementById('btnMoveToBottom') as any
        this.btnMoveToTop =this.shadowRoot!.getElementById('btnMoveToTop') as any
        this.currentButton = this.shadowRoot!.getElementById('btnPointer') as any
        const modalElement = document.getElementById('turnoutModal') as HTMLElement;
        this.turnoutModal = new bootstrap.Modal(modalElement);
        this.turnoutAddress = document.getElementById("turnoutAddress") as HTMLInputElement
        this.turnoutInverted = document.getElementById("turnoutInverted") as HTMLInputElement

        
        const hiddenDiv = document.getElementById("hiddenDiv") as HTMLDivElement
        document.getElementById("menuItem1")!.onclick = (e: MouseEvent) => {
            hiddenDiv.style.display = 'none'
            alert("OK")
        }

        window.addEventListener("click", (e: MouseEvent) => {
            // if(hiddenDiv.style.display != 'none')
            // hiddenDiv.style.display = 'none'
        })

        this.debugButtonEnabled = false
        this.consoleButtonEnabled = false
        this.programmerButtonEnabled = false

    }

    save() {
        this.canvas!.save()
    }

    private setDrawMode(mode: drawModes) {
        if (this.canvas) {
            this.canvas.drawMode = mode;
            console.log(`Aktuális mód: ${this.canvas.drawMode}`);
        }
        else {
            console.log("ERROR:", "nincs beállítva a canvas")
        }
    }


    private _currentElement: RailView | undefined;
    public get currentElement(): RailView {
        return this._currentElement!;
    }
    public set currentElement(v: RailView) {
        this._currentElement = v;
        if (this._currentElement) {
            this.shadowRoot!.getElementById("toolbarExt")!.style.display = 'block'
        } else {

            this.shadowRoot!.getElementById("toolbarExt")!.style.display = 'none'
        }
    }

    
    private _currentButton : any | undefined;
    public get currentButton() : any {
        return this._currentButton!;
    }
    public set currentButton(v : any) {
        if(this.currentButton) {
            this.currentButton.classList.remove("active")
        }
        this._currentButton = v;
        if(this.currentButton) {
            this.currentButton.classList.add("active")
        }
    }

    
    private _tasks : boolean = false;
    public get tasks() : boolean {
        return this._tasks;
    }
    public set tasks(v : boolean) {
        this._tasks = v;
        if(this.tasks) {
            this.btnTasks.classList.add("active")
        } else {
            this.btnTasks.classList.remove("active")
        }
    }
    
    
    private _debugButtonEnabled : boolean = false;
    public get debugButtonEnabled() : boolean  {
        return this._debugButtonEnabled;
    }
    public set debugButtonEnabled(v : boolean ) {
        this._debugButtonEnabled = v;
        if(v) {
            this.btnDebug.classList.remove("disabled")
        }
        else {
            this.btnDebug.classList.add("disabled")
        }
    }

    private _consoleButtonEnabled : boolean = false;
    public get consoleButtonEnabled() : boolean  {
        return this._consoleButtonEnabled;
    }
    public set consoleButtonEnabled(v : boolean ) {
        this._consoleButtonEnabled = v;
        if(v) {
            this.btnConsole.classList.remove("disabled")
        }
        else {
            this.btnConsole.classList.add("disabled")
        }
    }

    private _programmerButtonEnabled : boolean = false;
    public get programmerButtonEnabled() : boolean  {
        return this._programmerButtonEnabled;
    }
    public set programmerButtonEnabled(v : boolean ) {
        this._programmerButtonEnabled = v;
        if(v) {
            this.btnProgrammer.classList.remove("disabled")
        }
        else {
            this.btnProgrammer.classList.add("disabled")
        }
    }



    
}

customElements.define('custom-toolbar', Toolbar);
