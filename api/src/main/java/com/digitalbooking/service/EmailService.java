package com.digitalbooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(String toEmail, String username) {
        String subject = "Confirmación de Registro en Digital Booking";
        String body = "Hola " + username + ",\n\n"
                + "¡Te has registrado exitosamente en Digital Booking!\n\n"
                + "Tu nombre de usuario es: " + toEmail + "\n"
                + "Ya puedes iniciar sesión en tu cuenta en el siguiente enlace: http://localhost:5173/login\n\n"
                + "¡Sentite como en tu hogar!\n"
                + "El equipo de Digital Booking";

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("no-reply@digitalbooking.com");
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                System.out.println("EmailService: Correo electrónico de confirmación enviado exitosamente a " + toEmail);
                return;
            } catch (Exception e) {
                System.err.println("EmailService: Falló el envío de correo real: " + e.getMessage());
            }
        }

        // Fallback simulation log
        System.out.println("\n------------------------------------------------------------");
        System.out.println(">>> [EMAIL SIMULACIÓN] REGISTRO DE USUARIO <<<");
        System.out.println("Para: " + toEmail);
        System.out.println("Asunto: " + subject);
        System.out.println("Mensaje:\n" + body);
        System.out.println("------------------------------------------------------------\n");
    }
}
