"use client";

import { Navbar, Container, ButtonGroup, Button } from "react-bootstrap";
import Link from "next/link";

type NavbarProps = {
  language: "en" | "fr";
  setLanguage: (lang: "en" | "fr") => void;
};

export default function MyNavbar({ language, setLanguage }: NavbarProps) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} href="/">
          Interactive Dashboard
        </Navbar.Brand>
        <ButtonGroup size="sm">
          <Button
            variant={language === "en" ? "light" : "outline-light"}
            onClick={() => setLanguage("en")}
          >
            EN
          </Button>
          <Button
            variant={language === "fr" ? "light" : "outline-light"}
            onClick={() => setLanguage("fr")}
          >
            FR
          </Button>
        </ButtonGroup>
      </Container>
    </Navbar>
  );
}