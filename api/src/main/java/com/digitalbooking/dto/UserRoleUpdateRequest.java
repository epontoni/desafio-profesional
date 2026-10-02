package com.digitalbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UserRoleUpdateRequest {

    @NotBlank(message = "El rol es obligatorio.")
    @Pattern(regexp = "^(ROLE_USER|ROLE_ADMIN)$", message = "El rol debe ser ROLE_USER o ROLE_ADMIN.")
    private String role;

    public UserRoleUpdateRequest() {
    }

    public UserRoleUpdateRequest(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
