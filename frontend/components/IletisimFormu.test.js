import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "./../App";

test("hata olmadan render ediliyor", () => {
  render(<App />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const header = screen.getByText(/İletişim Formu/i);
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(ad, "İl");
  const errorMessage = await screen.findByTestId("error");
  expect(errorMessage).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByPlaceholderText(/İlhan/i);
  const soyad = screen.getByPlaceholderText(/Mansız/i);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(ad, "i");
  userEvent.type(soyad, "ma");
  userEvent.clear(soyad);
  userEvent.type(email, "yüz");
  const errorList = await screen.findAllByTestId("error");
  expect(errorList.length).toEqual(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByPlaceholderText(/İlhan/i);
  const soyad = screen.getByPlaceholderText(/Mansız/i);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  const button = screen.getByRole("button");
  userEvent.type(ad, "İlhan");
  userEvent.type(soyad, "Mansız");
  userEvent.click(button);
  const errorText = await screen.findByTestId("error");
  expect(errorText).toBeInTheDocument();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(email, "yüzyıl");
  const errorMessage = await screen.findByTestId("error");
  expect(errorMessage).toHaveTextContent(
    "email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const soyad = screen.getByPlaceholderText(/Mansız/i);
  const button = screen.getByRole("button");
  userEvent.click(button);
  const errorTextArray = await screen.findAllByTestId("error");
  expect(errorTextArray[1]).toHaveTextContent("soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByPlaceholderText(/İlhan/i);
  const soyad = screen.getByPlaceholderText(/Mansız/i);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  const button = screen.getByRole("button");
  expect(ad).toBeInTheDocument();
  expect(soyad).toBeInTheDocument();
  expect(email).toBeInTheDocument();
  userEvent.click(button);
  const errorTextArray = await screen.findAllByTestId("error");
  expect(errorTextArray.length).toEqual(3);
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByPlaceholderText(/İlhan/i);
  const soyad = screen.getByPlaceholderText(/Mansız/i);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  const mesaj = screen.getByLabelText("Mesaj");
  const button = screen.getByRole("button");
  userEvent.type(ad, "kubilay");
  userEvent.type(soyad, "öner");
  userEvent.type(email, "kubi@batu.com");
  userEvent.type(mesaj, "harika");
  userEvent.click(button);
  await waitFor(() => {
    const displayName = screen.getByTestId("firstnameDisplay");
    const displayLastName = screen.getByTestId("lastnameDisplay");
    const displayEmail = screen.getByTestId("emailDisplay");
    const displayMessage = screen.getByTestId("messageDisplay");
    expect(displayName).toBeInTheDocument();
    expect(displayLastName).toBeInTheDocument();
    expect(displayEmail).toBeInTheDocument();
    expect(displayMessage).toBeInTheDocument();
    expect(displayName).toHaveTextContent("kubilay");
    expect(displayLastName).toHaveTextContent("öner");
    expect(displayEmail).toHaveTextContent("kubi@batu.com");
    expect(displayMessage).toHaveTextContent("harika");
  });
});
