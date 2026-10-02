package com.digitalbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserPasswordUpdateRequest {

    @NotBlank(message = "La contraseña actual es obligatoria.")
    @Size(min = 8, message = "La contraseña actual debe tener al menos 8 caracteres.")
    private String currentPassword;

    @NotBlank(message = "La nueva contraseña es obligatoria.")
    @Size(min = 8, message = "La nueva contraseña debe tener al menos 8 caracteres.")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).+$", message = "La nueva contraseña debe contener al menos una letra mayúscula y un número.")
    private String newPassword;

    public UserPasswordUpdateRequest() {}

    public UserPasswordUpdateRequest(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
